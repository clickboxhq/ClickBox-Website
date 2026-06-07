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

// ─── Injection & Threat Detection (Layer 10) ─────────────────────────────────

const SQL_INJECTION = /(\bSELECT\b|\bINSERT\b|\bDROP\b|\bUPDATE\b|\bDELETE\b|\bUNION\b|\bEXEC\b|\bTRUNCATE\b)/i;
const SCRIPT_TAG = /<script[\s\S]*?>[\s\S]*?<\/script>/i;
const JS_PROTOCOL = /javascript:/i;
const EVENT_HANDLER = /on\w+\s*=/i;
const TEMPLATE_INJECTION = /\{\{.*?\}\}/;
const TEMPLATE_LITERAL = /\$\{.*?\}/;

/**
 * Returns true if the input contains patterns that look like an injection attempt.
 * Used as an additional server-side signal — do not rely on this alone.
 */
export const detectInjectionAttempt = (input: string): boolean =>
  [SQL_INJECTION, SCRIPT_TAG, JS_PROTOCOL, EVENT_HANDLER, TEMPLATE_INJECTION, TEMPLATE_LITERAL]
    .some((p) => p.test(input));

/**
 * Normalize Unicode to NFC/NFKC to prevent homograph attacks where visually
 * similar characters map to different code points.
 */
export const normalizeUnicode = (input: string): string =>
  input.normalize("NFKC");

/**
 * Heuristic spam detector. A message is likely spam if it has many words
 * but very few unique ones (high repetition ratio).
 */
export const isSpam = (input: string): boolean => {
  const words = input.toLowerCase().split(/\s+/);
  if (words.length < 20) return false;
  const unique = new Set(words);
  return unique.size / words.length < 0.3;
};
