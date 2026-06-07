// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { checkRateLimit } from "../_shared/rateLimiter.ts";

const ALLOWED_EVENTS = [
  "AUTH_LOGIN",
  "AUTH_LOGOUT",
  "AUTH_FAILED",
  "AUTH_MFA_FAILED",
] as const;

serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const clientIP =
      req.headers.get("CF-Connecting-IP") ??
      req.headers.get("X-Forwarded-For")?.split(",")[0].trim() ??
      "unknown";

    // Rate limit: 20 per IP per minute
    if (checkRateLimit(`log-auth:${clientIP}`, 20, 60)) {
      return new Response("Rate limited", { status: 429 });
    }

    const { event, email, user_id } = await req.json();

    if (!ALLOWED_EVENTS.includes(event)) {
      return errorResponse("Invalid event", 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    await supabase.from("admin_audit_log").insert({
      actor_id: user_id ?? null,
      action: event,
      target_table: null,
      target_id: null,
      payload: { email: email ?? null },
      created_at: new Date().toISOString(),
    });

    // Alert on repeated failures from same IP (5 failures in 5 min)
    if (event === "AUTH_FAILED") {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("admin_audit_log")
        .select("*", { count: "exact", head: true })
        .eq("action", "AUTH_FAILED")
        .gte("created_at", fiveMinutesAgo);

      if ((count ?? 0) >= 5) {
        const alertUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/alert-handler`;
        await fetch(alertUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            type: "BRUTE_FORCE_DETECTED",
            ip: clientIP,
            count,
            email,
          }),
        }).catch(() => {/* non-blocking */});
      }
    }

    return jsonResponse({ success: true });
  } catch (err) {
    console.error("log-auth-event error:", err);
    return errorResponse("Error", 500);
  }
});
