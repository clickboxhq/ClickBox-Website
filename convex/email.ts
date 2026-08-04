import { v } from "convex/values";
import { action, internalMutation, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const SITE_URL = process.env.SITE_URL ?? "https://useclickbox.com";

function certificateEmailHtml(params: {
  recipientName: string;
  programName: string;
  certificateNumber: string;
  verifyUrl: string;
}) {
  const { recipientName, programName, certificateNumber, verifyUrl } = params;
  return `
  <div style="font-family: 'DM Sans', Arial, sans-serif; background:#0D2028; padding:40px 24px; color:#F7F3F2;">
    <div style="max-width:520px; margin:0 auto; background:#153140; border-radius:16px; padding:32px; border:1px solid rgba(189,196,198,0.18);">
      <p style="font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#53B5E0; margin:0 0 16px;">ClickBox Certificate Platform</p>
      <h1 style="font-size:22px; margin:0 0 16px; color:#FFFFFF;">Congratulations, ${recipientName}!</h1>
      <p style="font-size:15px; line-height:1.6; color:#BDC4C6; margin:0 0 24px;">
        Your ClickBox certificate for <strong style="color:#FFFFFF;">${programName}</strong> is ready to download.
      </p>
      <a href="${verifyUrl}" style="display:inline-block; background:#53B5E0; color:#0D2028; font-weight:600; text-decoration:none; padding:12px 24px; border-radius:8px; font-size:14px;">
        Download Certificate
      </a>
      <p style="font-size:12px; color:#455A63; margin:24px 0 0;">Certificate number: ${certificateNumber}</p>
    </div>
  </div>`;
}

export const sendCertificateReady = action({
  args: { sessionToken: v.string(), certificateId: v.id("certificates") },
  handler: async (ctx, { sessionToken, certificateId }) => {
    await ctx.runQuery(internal.admin.validateSessionInternal, { sessionToken });
    return sendForCertificate(ctx, certificateId);
  },
});

export const bulkSendCertificateReady = action({
  args: { sessionToken: v.string(), certificateIds: v.array(v.id("certificates")) },
  handler: async (ctx, { sessionToken, certificateIds }) => {
    await ctx.runQuery(internal.admin.validateSessionInternal, { sessionToken });

    let sent = 0;
    let failed = 0;
    for (const certificateId of certificateIds) {
      try {
        await sendForCertificate(ctx, certificateId);
        sent++;
      } catch {
        failed++;
      }
    }
    return { sent, failed };
  },
});

async function sendForCertificate(ctx: ActionCtx, certificateId: Id<"certificates">) {
  const certificate = await ctx.runQuery(internal.certificates.getByIdInternal, { certificateId });
  if (!certificate) throw new Error("Certificate not found");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured on the Convex deployment");

  const verifyUrl = `${SITE_URL}/verify/${certificate.certificateNumber}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_ADDRESS ?? "ClickBox Certificates <certificates@useclickbox.com>",
      to: [certificate.recipientEmail],
      subject: "Your ClickBox Certificate is Ready",
      html: certificateEmailHtml({
        recipientName: certificate.recipientName,
        programName: certificate.programName,
        certificateNumber: certificate.certificateNumber,
        verifyUrl,
      }),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error (${res.status}): ${body}`);
  }

  await ctx.runMutation(internal.email.markEmailSent, { certificateId });
}

export const markEmailSent = internalMutation({
  args: { certificateId: v.id("certificates") },
  handler: async (ctx, { certificateId }) => {
    await ctx.db.patch(certificateId, { emailSentAt: Date.now() });
  },
});
