// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { jsonResponse, errorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  // Only accept calls from service role key
  const auth = req.headers.get("Authorization");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceKey || auth !== `Bearer ${serviceKey}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { type, ip, count, email } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const ALERT_EMAIL = Deno.env.get("ALERT_EMAIL_TO");

    if (RESEND_API_KEY && ALERT_EMAIL) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "security@useclickbox.com",
          to: ALERT_EMAIL,
          subject: `ClickBox Security Alert: ${type}`,
          html: `
            <h2>Security Alert — ${type}</h2>
            <table cellpadding="8" style="border-collapse:collapse">
              <tr><td><strong>Type</strong></td><td>${type}</td></tr>
              <tr><td><strong>IP</strong></td><td>${ip ?? "unknown"}</td></tr>
              <tr><td><strong>Attempts</strong></td><td>${count ?? "N/A"}</td></tr>
              <tr><td><strong>Email targeted</strong></td><td>${email ?? "N/A"}</td></tr>
              <tr><td><strong>Time</strong></td><td>${new Date().toISOString()}</td></tr>
            </table>
            <p><a href="https://useclickbox.com/admin">Review in Admin Dashboard →</a></p>
          `,
        }),
      });
    } else {
      console.warn("Resend not configured — alert not sent", { type, ip });
    }

    return jsonResponse({ sent: !!RESEND_API_KEY });
  } catch (err) {
    console.error("alert-handler error:", err);
    return errorResponse("Error", 500);
  }
});
