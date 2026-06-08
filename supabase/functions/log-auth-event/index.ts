// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");

    if (!token) {
      return errorResponse("Unauthorized", 401);
    }

    let actorId: string | null = null;

    if (token === anonKey) {
      // Pre-auth events (failed login) use anon key
      actorId = null;
    } else {
      const userClient = createClient(supabaseUrl, anonKey);
      const { data: { user }, error } = await userClient.auth.getUser(token);
      if (error || !user) {
        return errorResponse("Unauthorized", 401);
      }
      actorId = user.id;
    }

    const clientIP =
      req.headers.get("CF-Connecting-IP") ??
      req.headers.get("X-Forwarded-For")?.split(",")[0].trim() ??
      "unknown";

    if (checkRateLimit(`log-auth:${clientIP}`, 20, 60)) {
      return new Response("Rate limited", { status: 429 });
    }

    const { event, email } = await req.json();

    if (!ALLOWED_EVENTS.includes(event)) {
      return errorResponse("Invalid event", 400);
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    await supabase.from("admin_audit_log").insert({
      actor_id: actorId,
      action: event,
      target_table: null,
      target_id: null,
      payload: { email: email ?? null, ip: clientIP },
      ip_address: clientIP,
      created_at: new Date().toISOString(),
    });

    if (event === "AUTH_FAILED") {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("admin_audit_log")
        .select("*", { count: "exact", head: true })
        .eq("action", "AUTH_FAILED")
        .eq("ip_address", clientIP)
        .gte("created_at", fiveMinutesAgo);

      if ((count ?? 0) >= 5) {
        const alertUrl = `${supabaseUrl}/functions/v1/alert-handler`;
        await fetch(alertUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceKey}`,
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
