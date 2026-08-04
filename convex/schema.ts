import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  programs: defineTable({
    name: v.string(), // e.g. "Internship 2026"
    type: v.union(
      v.literal("internship"),
      v.literal("corporate-training"),
      v.literal("bootcamp"),
      v.literal("workshop"),
      v.literal("course"),
    ),
    programCode: v.string(), // short code used in certificate numbers, e.g. "INT26"
    description: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_programCode", ["programCode"]),

  participants: defineTable({
    programId: v.id("programs"),
    fullName: v.string(),
    email: v.string(),
    eligible: v.boolean(),
    certificateId: v.optional(v.id("certificates")),
    importedAt: v.number(),
  })
    .index("by_program", ["programId"])
    .index("by_email", ["email"]),

  certificates: defineTable({
    certificateNumber: v.string(),
    recipientName: v.string(),
    recipientEmail: v.string(),
    programId: v.id("programs"),
    programName: v.string(), // denormalized snapshot at issue time
    programType: v.union(
      v.literal("internship"),
      v.literal("corporate-training"),
      v.literal("bootcamp"),
      v.literal("workshop"),
      v.literal("course"),
    ),
    issueDate: v.number(),
    status: v.union(v.literal("active"), v.literal("revoked")),
    emailSentAt: v.optional(v.number()),
    createdAt: v.number(),
    createdBy: v.string(), // admin email
  })
    .index("by_certificateNumber", ["certificateNumber"])
    .index("by_recipientEmail", ["recipientEmail"])
    .index("by_program", ["programId"]),

  auditLog: defineTable({
    action: v.union(
      v.literal("generate"),
      v.literal("regenerate"),
      v.literal("revoke"),
      v.literal("reinstate"),
      v.literal("delete"),
      v.literal("bulk_generate"),
      v.literal("bulk_email"),
      v.literal("import_participants"),
    ),
    actor: v.string(), // admin email
    certificateId: v.optional(v.id("certificates")),
    detail: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  adminSessions: defineTable({
    tokenHash: v.string(),
    adminEmail: v.string(),
    expiresAt: v.number(),
  }).index("by_tokenHash", ["tokenHash"]),
});
