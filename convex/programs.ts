import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

const programType = v.union(
  v.literal("internship"),
  v.literal("corporate-training"),
  v.literal("bootcamp"),
  v.literal("workshop"),
  v.literal("course"),
);

export const create = mutation({
  args: {
    sessionToken: v.string(),
    name: v.string(),
    type: programType,
    programCode: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { sessionToken, name, type, programCode, description }) => {
    await requireAdmin(ctx, sessionToken);
    return ctx.db.insert("programs", {
      name,
      type,
      programCode: programCode.toUpperCase(),
      description,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    await requireAdmin(ctx, sessionToken);
    return ctx.db.query("programs").order("desc").collect();
  },
});
