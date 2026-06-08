// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3";
import { corsHeaders, handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { checkRateLimit } from "../_shared/rateLimiter.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";
import { sanitizeText, sanitizeEmail, detectInjection, isSpam } from "../_shared/sanitize.ts";

const ALLOWED_RESUME_DOMAINS = [
  "linkedin.com", "www.linkedin.com",
  "drive.google.com", "docs.google.com",
  "dropbox.com", "www.dropbox.com",
  "notion.so", "www.notion.so",
  "github.com", "www.github.com",
  "read.cv", "www.read.cv",
  "portfolio.adobe.com",
];

function validateResumeUrl(url: string): { valid: boolean; domain?: string } {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return { valid: false };
    if (parsed.username || parsed.password) return { valid: false };
    const allowed = ALLOWED_RESUME_DOMAINS.some(
      (d) => parsed.hostname === d || parsed.hostname.endsWith("." + d),
    );
    if (!allowed) return { valid: false };
    return { valid: true, domain: parsed.hostname.replace(/^www\./, "") };
  } catch {
    return { valid: false };
  }
}

const schema = z.object({
  full_name: z.string().min(2).max(120),
  email: z.string().email().max(255),
  linkedin: z.string().url().max(300).startsWith("https://"),
  resume_url: z.string().url().max(500).startsWith("https://").optional(),
  preferred_pathway: z.string().min(1).max(120),
  certifications: z.string().max(1000).optional(),
  certification_links: z.string().max(2000).optional(),
  relevant_experience: z.string().max(2000).optional(),
  motivation: z.string().min(10).max(2000),
  portfolio: z.string().url().max(500).startsWith("https://").optional(),
  honeypot: z.string().max(0),
  turnstile_token: z.string().min(1),
  submitted_at: z.number(),
});

serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const clientIP =
      req.headers.get("CF-Connecting-IP") ??
      req.headers.get("X-Forwarded-For")?.split(",")[0].trim() ??
      "unknown";
    const userAgent = req.headers.get("User-Agent")?.slice(0, 500) ?? "";

    const body = await req.json();

    if (body.submitted_at && Date.now() - body.submitted_at < 3000) {
      return jsonResponse({ success: true });
    }
    if (body.honeypot !== "") {
      return jsonResponse({ success: true });
    }

    const turnstile = await verifyTurnstile(body.turnstile_token, clientIP);
    if (!turnstile.success) {
      return errorResponse("Bot verification failed", 403);
    }

    if (checkRateLimit(`fellowship:${clientIP}`, 3, 3600)) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const result = schema.safeParse(body);
    if (!result.success) {
      return errorResponse("Validation failed", 422);
    }

    const {
      full_name, email, linkedin, resume_url,
      preferred_pathway, certifications, certification_links,
      relevant_experience, motivation, portfolio,
    } = result.data;

    if (
      detectInjection(full_name) ||
      detectInjection(motivation) ||
      isSpam(motivation)
    ) {
      return jsonResponse({ success: true });
    }

    // LinkedIn must be a linkedin.com profile URL
    const linkedinCheck = validateResumeUrl(linkedin);
    if (!linkedinCheck.valid || !linkedinCheck.domain?.includes("linkedin.com")) {
      return errorResponse("LinkedIn profile must be a valid https://linkedin.com URL.", 422);
    }

    // Resume URL domain validation
    let resumeUrlDomain: string | null = null;
    if (resume_url) {
      const validation = validateResumeUrl(resume_url);
      if (!validation.valid) {
        return errorResponse(
          "Resume link must be from LinkedIn, Google Drive, Dropbox, Notion, GitHub, or Read.cv.",
          422,
        );
      }
      resumeUrlDomain = validation.domain ?? null;
    }

    if (portfolio) {
      const portfolioCheck = validateResumeUrl(portfolio);
      if (!portfolioCheck.valid) {
        return errorResponse("Portfolio must be a valid HTTPS URL from an allowed host.", 422);
      }
    }

    if (certification_links) {
      const lines = certification_links.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const certCheck = validateResumeUrl(line);
        if (!certCheck.valid) {
          return errorResponse(
            "Each certification link must be a valid HTTPS URL from an allowed host.",
            422,
          );
        }
      }
    }

    const clean = {
      full_name: sanitizeText(full_name, 120),
      email: sanitizeEmail(email),
      linkedin: linkedin.slice(0, 300),
      resume_url: resume_url ?? null,
      resume_url_domain: resumeUrlDomain,
      preferred_pathway: sanitizeText(preferred_pathway, 120),
      certifications: certifications ? sanitizeText(certifications, 1000) : null,
      certification_links: certification_links
        ? sanitizeText(certification_links, 2000)
        : null,
      relevant_experience: relevant_experience
        ? sanitizeText(relevant_experience, 2000)
        : null,
      motivation: sanitizeText(motivation, 2000),
      portfolio: portfolio ?? null,
      ip_address: clientIP,
      user_agent: userAgent,
    };

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: existing } = await supabase
      .from("fellowship_applications")
      .select("id")
      .eq("email", clean.email)
      .gte("created_at", new Date(Date.now() - 86400000).toISOString())
      .limit(1);

    if (existing && existing.length > 0) {
      return errorResponse("A submission from this email was recently received.", 429);
    }

    const { error } = await supabase.from("fellowship_applications").insert(clean);
    if (error) throw error;

    return jsonResponse({ success: true });
  } catch (err) {
    console.error("submit-fellowship error:", err);
    return errorResponse("An error occurred. Please try again.", 500);
  }
});
