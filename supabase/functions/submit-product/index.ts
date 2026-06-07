// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3";
import { corsHeaders, handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { checkRateLimit } from "../_shared/rateLimiter.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";
import { sanitizeText, sanitizeEmail, detectInjection, isSpam } from "../_shared/sanitize.ts";

const schema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().min(1).max(150),
  email: z.string().email().max(255),
  product_interest: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
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

    if (checkRateLimit(`product:${clientIP}`, 3, 3600)) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const result = schema.safeParse(body);
    if (!result.success) {
      return errorResponse("Validation failed", 422);
    }

    const { name, company, email, product_interest, message } = result.data;

    if (
      detectInjection(name) ||
      detectInjection(message) ||
      detectInjection(product_interest) ||
      isSpam(message)
    ) {
      return jsonResponse({ success: true });
    }

    const clean = {
      name: sanitizeText(name, 120),
      company: sanitizeText(company, 150),
      email: sanitizeEmail(email),
      product_interest: sanitizeText(product_interest, 200),
      message: sanitizeText(message, 5000),
      ip_address: clientIP,
      user_agent: userAgent,
    };

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: existing } = await supabase
      .from("product_inquiries")
      .select("id")
      .eq("email", clean.email)
      .gte("created_at", new Date(Date.now() - 86400000).toISOString())
      .limit(1);

    if (existing && existing.length > 0) {
      return errorResponse("A submission from this email was recently received.", 429);
    }

    const { error } = await supabase.from("product_inquiries").insert(clean);
    if (error) throw error;

    return jsonResponse({ success: true });
  } catch (err) {
    console.error("submit-product error:", err);
    return errorResponse("An error occurred. Please try again.", 500);
  }
});
