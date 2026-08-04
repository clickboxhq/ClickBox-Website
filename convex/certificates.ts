import { v } from "convex/values";
import { mutation, query, internalQuery, type MutationCtx } from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { generateCertificateNumber } from "./lib/certificateNumber";

const CERT_NUMBER_MAX_ATTEMPTS = 5;

async function uniqueCertificateNumber(
  ctx: MutationCtx,
  programCode: string,
  issueDate: number,
) {
  for (let attempt = 0; attempt < CERT_NUMBER_MAX_ATTEMPTS; attempt++) {
    const candidate = generateCertificateNumber(programCode, issueDate);
    const existing = await ctx.db
      .query("certificates")
      .withIndex("by_certificateNumber", (q) => q.eq("certificateNumber", candidate))
      .unique();
    if (!existing) return candidate;
  }
  throw new Error("Could not generate a unique certificate number, please retry");
}

export const getByNumber = query({
  args: { certificateNumber: v.string() },
  handler: async (ctx, { certificateNumber }) => {
    return ctx.db
      .query("certificates")
      .withIndex("by_certificateNumber", (q) =>
        q.eq("certificateNumber", certificateNumber.trim().toUpperCase()),
      )
      .unique();
  },
});

// Internal variant callable from actions (email sending) without exposing it publicly.
export const getByNumberInternal = internalQuery({
  args: { certificateNumber: v.string() },
  handler: async (ctx, { certificateNumber }) => {
    return ctx.db
      .query("certificates")
      .withIndex("by_certificateNumber", (q) => q.eq("certificateNumber", certificateNumber))
      .unique();
  },
});

export const getByIdInternal = internalQuery({
  args: { certificateId: v.id("certificates") },
  handler: async (ctx, { certificateId }) => ctx.db.get(certificateId),
});

export const getByEmailOrNumber = query({
  args: { search: v.string() },
  handler: async (ctx, { search }) => {
    const trimmed = search.trim();
    if (!trimmed) return [];

    if (/^CB-/i.test(trimmed)) {
      const cert = await ctx.db
        .query("certificates")
        .withIndex("by_certificateNumber", (q) => q.eq("certificateNumber", trimmed.toUpperCase()))
        .unique();
      return cert ? [cert] : [];
    }

    return ctx.db
      .query("certificates")
      .withIndex("by_recipientEmail", (q) => q.eq("recipientEmail", trimmed.toLowerCase()))
      .collect();
  },
});

export const listAll = query({
  args: { sessionToken: v.string(), search: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, search }) => {
    await requireAdmin(ctx, sessionToken);
    const all = await ctx.db.query("certificates").order("desc").collect();
    if (!search?.trim()) return all;
    const needle = search.trim().toLowerCase();
    return all.filter(
      (c) =>
        c.certificateNumber.toLowerCase().includes(needle) ||
        c.recipientName.toLowerCase().includes(needle) ||
        c.recipientEmail.toLowerCase().includes(needle) ||
        c.programName.toLowerCase().includes(needle),
    );
  },
});

export const create = mutation({
  args: {
    sessionToken: v.string(),
    recipientName: v.string(),
    recipientEmail: v.string(),
    programId: v.id("programs"),
  },
  handler: async (ctx, { sessionToken, recipientName, recipientEmail, programId }) => {
    const actor = await requireAdmin(ctx, sessionToken);
    const program = await ctx.db.get(programId);
    if (!program) throw new Error("Program not found");

    const issueDate = Date.now();
    const certificateNumber = await uniqueCertificateNumber(ctx, program.programCode, issueDate);

    const certificateId = await ctx.db.insert("certificates", {
      certificateNumber,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim().toLowerCase(),
      programId,
      programName: program.name,
      programType: program.type,
      issueDate,
      status: "active",
      createdAt: issueDate,
      createdBy: actor,
    });

    await ctx.db.insert("auditLog", {
      action: "generate",
      actor,
      certificateId,
      detail: certificateNumber,
      createdAt: issueDate,
    });

    return certificateId;
  },
});

export const regenerate = mutation({
  args: { sessionToken: v.string(), certificateId: v.id("certificates") },
  handler: async (ctx, { sessionToken, certificateId }) => {
    const actor = await requireAdmin(ctx, sessionToken);
    const existing = await ctx.db.get(certificateId);
    if (!existing) throw new Error("Certificate not found");

    const program = await ctx.db.get(existing.programId);
    const issueDate = Date.now();
    const certificateNumber = await uniqueCertificateNumber(
      ctx,
      program?.programCode ?? "GEN",
      issueDate,
    );

    const newCertificateId = await ctx.db.insert("certificates", {
      certificateNumber,
      recipientName: existing.recipientName,
      recipientEmail: existing.recipientEmail,
      programId: existing.programId,
      programName: existing.programName,
      programType: existing.programType,
      issueDate,
      status: "active",
      createdAt: issueDate,
      createdBy: actor,
    });

    await ctx.db.delete(certificateId);

    await ctx.db.insert("auditLog", {
      action: "regenerate",
      actor,
      certificateId: newCertificateId,
      detail: `Replaced ${existing.certificateNumber} with ${certificateNumber}`,
      createdAt: issueDate,
    });

    return newCertificateId;
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    certificateId: v.id("certificates"),
    recipientName: v.optional(v.string()),
    recipientEmail: v.optional(v.string()),
    programName: v.optional(v.string()),
  },
  handler: async (ctx, { sessionToken, certificateId, ...patch }) => {
    const actor = await requireAdmin(ctx, sessionToken);
    const existing = await ctx.db.get(certificateId);
    if (!existing) throw new Error("Certificate not found");

    const cleanPatch: Record<string, string> = {};
    if (patch.recipientName !== undefined) cleanPatch.recipientName = patch.recipientName.trim();
    if (patch.recipientEmail !== undefined)
      cleanPatch.recipientEmail = patch.recipientEmail.trim().toLowerCase();
    if (patch.programName !== undefined) cleanPatch.programName = patch.programName.trim();

    await ctx.db.patch(certificateId, cleanPatch);
    await ctx.db.insert("auditLog", {
      action: "generate",
      actor,
      certificateId,
      detail: `Edited fields: ${Object.keys(cleanPatch).join(", ") || "none"}`,
      createdAt: Date.now(),
    });
  },
});

export const setStatus = mutation({
  args: {
    sessionToken: v.string(),
    certificateId: v.id("certificates"),
    status: v.union(v.literal("active"), v.literal("revoked")),
  },
  handler: async (ctx, { sessionToken, certificateId, status }) => {
    const actor = await requireAdmin(ctx, sessionToken);
    const existing = await ctx.db.get(certificateId);
    if (!existing) throw new Error("Certificate not found");

    await ctx.db.patch(certificateId, { status });
    await ctx.db.insert("auditLog", {
      action: status === "revoked" ? "revoke" : "reinstate",
      actor,
      certificateId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { sessionToken: v.string(), certificateId: v.id("certificates") },
  handler: async (ctx, { sessionToken, certificateId }) => {
    const actor = await requireAdmin(ctx, sessionToken);
    const existing = await ctx.db.get(certificateId);
    if (!existing) throw new Error("Certificate not found");

    await ctx.db.delete(certificateId);
    await ctx.db.insert("auditLog", {
      action: "delete",
      actor,
      detail: existing.certificateNumber,
      createdAt: Date.now(),
    });
  },
});

export const bulkGenerate = mutation({
  args: { sessionToken: v.string(), programId: v.id("programs") },
  handler: async (ctx, { sessionToken, programId }) => {
    const actor = await requireAdmin(ctx, sessionToken);
    const program = await ctx.db.get(programId);
    if (!program) throw new Error("Program not found");

    const participants = await ctx.db
      .query("participants")
      .withIndex("by_program", (q) => q.eq("programId", programId))
      .collect();

    const eligible = participants.filter((p) => p.eligible && !p.certificateId);
    const issueDate = Date.now();
    const createdIds: string[] = [];

    for (const participant of eligible) {
      const certificateNumber = await uniqueCertificateNumber(ctx, program.programCode, issueDate);
      const certificateId = await ctx.db.insert("certificates", {
        certificateNumber,
        recipientName: participant.fullName,
        recipientEmail: participant.email,
        programId,
        programName: program.name,
        programType: program.type,
        issueDate,
        status: "active",
        createdAt: issueDate,
        createdBy: actor,
      });
      await ctx.db.patch(participant._id, { certificateId });
      createdIds.push(certificateId);
    }

    await ctx.db.insert("auditLog", {
      action: "bulk_generate",
      actor,
      detail: `Generated ${createdIds.length} certificate(s) for "${program.name}"`,
      createdAt: issueDate,
    });

    return { generated: createdIds.length, certificateIds: createdIds };
  },
});
