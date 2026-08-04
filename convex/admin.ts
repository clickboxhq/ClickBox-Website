import { v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";
import { generateToken, hashToken, requireAdmin, SESSION_TTL } from "./lib/auth";

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("Admin credentials are not configured on the server");
    }
    if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() || password !== adminPassword) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken();
    const tokenHash = await hashToken(token);
    const expiresAt = Date.now() + SESSION_TTL;

    await ctx.db.insert("adminSessions", { tokenHash, adminEmail, expiresAt });

    return { token, expiresAt };
  },
});

export const logout = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    const tokenHash = await hashToken(sessionToken);
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
      .unique();
    if (session) await ctx.db.delete(session._id);
  },
});

export const validateSession = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    try {
      const adminEmail = await requireAdmin(ctx, sessionToken);
      return { valid: true as const, adminEmail };
    } catch {
      return { valid: false as const };
    }
  },
});

// Used internally by actions (e.g. email sending) that cannot touch ctx.db directly.
export const validateSessionInternal = internalQuery({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    return requireAdmin(ctx, sessionToken);
  },
});
