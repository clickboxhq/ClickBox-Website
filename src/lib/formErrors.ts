import type { ZodError } from "zod";

export const FORM_FIELD_LABELS: Record<string, string> = {
  full_name: "Full Name",
  email: "Email",
  linkedin: "LinkedIn Profile",
  resume_url: "Resume",
  resume: "Resume",
  preferred_pathway: "Preferred Career Pathway",
  certifications: "Certifications",
  certification_links: "Certification Links",
  relevant_experience: "Relevant Experience",
  motivation: "Why do you want to join?",
  portfolio: "Portfolio / GitHub Link",
  name: "Name",
  phone: "Phone",
  company: "Company",
  subject: "Subject",
  message: "Message",
  product_interest: "Product Interest",
};

export type FieldErrors = Record<string, string>;

export type ValidationFailure = {
  ok: false;
  message: string;
  fieldErrors: FieldErrors;
};

export const labelForField = (field: string) =>
  FORM_FIELD_LABELS[field] ?? field.replace(/_/g, " ");

export const formatFieldMessage = (field: string, message: string) => {
  const label = labelForField(field);
  if (message.toLowerCase().includes(label.toLowerCase())) return message;
  return `${label}: ${message}`;
};

export const formatZodError = (error: ZodError): ValidationFailure => {
  const fieldErrors: FieldErrors = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "");
    if (!field || fieldErrors[field]) continue;
    fieldErrors[field] = formatFieldMessage(field, issue.message);
  }

  const firstField = String(error.issues[0]?.path[0] ?? "");
  const message =
    (firstField && fieldErrors[firstField]) ||
    error.issues[0]?.message ||
    "Please review the highlighted fields.";

  return { ok: false, message, fieldErrors };
};
