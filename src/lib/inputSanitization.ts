/**
 * Shared input sanitization for public-facing forms.
 */

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const HTML_TAG = /<[^>]*>/g;

export const sanitizeText = (value: FormDataEntryValue | null, max = 2000): string =>
  String(value ?? "")
    .replace(CONTROL_CHARS, "")
    .replace(HTML_TAG, "")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export const sanitizeOptionalText = (value: FormDataEntryValue | null, max = 2000): string | null => {
  const cleaned = sanitizeText(value, max);
  return cleaned ? cleaned : null;
};

export const sanitizeEmail = (value: FormDataEntryValue | null): string =>
  sanitizeText(value, 255).toLowerCase();

export const sanitizePhone = (value: FormDataEntryValue | null, max = 40): string | null => {
  const cleaned = String(value ?? "")
    .replace(CONTROL_CHARS, "")
    .replace(/[^\d+\-().\s]/g, "")
    .trim()
    .slice(0, max);
  return cleaned ? cleaned : null;
};

export const sanitizeMultilineText = (value: FormDataEntryValue | null, max = 5000): string =>
  String(value ?? "")
    .replace(CONTROL_CHARS, "")
    .replace(HTML_TAG, "")
    .trim()
    .slice(0, max);

/** @deprecated Use sanitizeText */
export const clean = sanitizeText;

/** @deprecated Use sanitizeOptionalText */
export const nullable = sanitizeOptionalText;
