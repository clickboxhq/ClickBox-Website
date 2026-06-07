export async function verifyTurnstile(
  token: string,
  ip: string | null,
): Promise<{ success: boolean }> {
  const secretKey = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secretKey) {
    // If secret not configured, skip verification (dev mode).
    console.warn("TURNSTILE_SECRET_KEY not set — skipping verification");
    return { success: true };
  }

  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (ip) body.set("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  const data = await res.json();
  return { success: data.success === true };
}
