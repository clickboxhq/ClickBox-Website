import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const importParticipants = mutation({
  args: {
    sessionToken: v.string(),
    programId: v.id("programs"),
    rows: v.array(v.object({ fullName: v.string(), email: v.string() })),
  },
  handler: async (ctx, { sessionToken, programId, rows }) => {
    const actor = await requireAdmin(ctx, sessionToken);

    const program = await ctx.db.get(programId);
    if (!program) throw new Error("Program not found");

    const now = Date.now();
    let inserted = 0;
    for (const row of rows) {
      const email = row.email.trim().toLowerCase();
      const fullName = row.fullName.trim();
      if (!email || !fullName) continue;

      const existing = await ctx.db
        .query("participants")
        .withIndex("by_email", (q) => q.eq("email", email))
        .filter((q) => q.eq(q.field("programId"), programId))
        .unique();
      if (existing) continue;

      await ctx.db.insert("participants", {
        programId,
        fullName,
        email,
        eligible: true,
        importedAt: now,
      });
      inserted++;
    }

    await ctx.db.insert("auditLog", {
      action: "import_participants",
      actor,
      detail: `Imported ${inserted} participant(s) into "${program.name}"`,
      createdAt: now,
    });

    return { inserted, skipped: rows.length - inserted };
  },
});

export const listByProgram = query({
  args: { sessionToken: v.string(), programId: v.id("programs") },
  handler: async (ctx, { sessionToken, programId }) => {
    await requireAdmin(ctx, sessionToken);
    return ctx.db
      .query("participants")
      .withIndex("by_program", (q) => q.eq("programId", programId))
      .collect();
  },
});
