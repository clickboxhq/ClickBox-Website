import type { MutationCtx, QueryCtx } from "../_generated/server";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashToken(token: string): Promise<string> {
  return sha256Hex(token);
}

export const SESSION_TTL = SESSION_TTL_MS;

export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string,
): Promise<string> {
  const tokenHash = await hashToken(sessionToken);
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
    .unique();

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Unauthorized: session invalid or expired");
  }

  return session.adminEmail;
}
