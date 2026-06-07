// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    // Only allow calls from service role (internal Edge Function calls)
    const auth = req.headers.get("Authorization");
    const expectedToken = `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`;
    if (auth !== expectedToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    if (authError || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { data: roleData } = await userSupabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleData?.role !== "admin") {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { email } = body;
    if (!email || typeof email !== "string") {
      return errorResponse("Invalid email", 400);
    }

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(email);
    if (error) throw error;

    await adminSupabase.from("admin_audit_log").insert({
      actor_id: user.id,
      action: "ADMIN_INVITED",
      target_table: "auth.users",
      target_id: null,
      payload: { invited_email: email },
    });

    return jsonResponse({ success: true, userId: data.user.id });
  } catch (err) {
    console.error("invite-admin error:", err);
    return errorResponse("Internal error", 500);
  }
});
