/**
 * Flexible URL validation for fellowship and contact forms.
 * Accepts URLs with or without a protocol and normalizes to https:// for storage.
 */

const PROTOCOL_PATTERN = /^https?:\/\//i;
const DANGEROUS_SCHEME = /^(javascript|data|vbscript|file):/i;
const TRAILING_PUNCTUATION = /[.,;)\]}>"']+$/;

export const sanitizeUrlInput = (value: string): string =>
  value.trim().replace(TRAILING_PUNCTUATION, "").trim();

export const normalizeUrl = (value: string): string => {
  const trimmed = sanitizeUrlInput(value);
  if (!trimmed) return trimmed;
  return PROTOCOL_PATTERN.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export const isValidUrl = (value: string): boolean => {
  const trimmed = sanitizeUrlInput(value);
  if (!trimmed) return false;
  if (DANGEROUS_SCHEME.test(trimmed)) return false;

  try {
    const parsed = new URL(normalizeUrl(trimmed));
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    if (!parsed.hostname || parsed.hostname.length === 0) return false;
    if (parsed.hostname === "localhost") return true;
    if (parsed.hostname.includes(".")) return true;
    // Allow bare domains like https://intranet (unlikely but valid URL shape).
    return parsed.hostname.length >= 2;
  } catch {
    return false;
  }
};

export type CertificationLinksResult =
  | { ok: true; value: string }
  | { ok: false; line: number; invalidValue: string };

export const validateCertificationLinks = (
  value: string | null | undefined,
): CertificationLinksResult | { ok: true; value: null } => {
  if (value == null || value.trim() === "") return { ok: true, value: null };

  const lines = value
    .split(/\r?\n/)
    .flatMap((line) => line.split(/[,;]+/))
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return { ok: true, value: null };

  const normalized: string[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!isValidUrl(line)) {
      return { ok: false, line: index + 1, invalidValue: line };
    }
    normalized.push(normalizeUrl(line));
  }

  return { ok: true, value: normalized.join("\n") };
};

/** @deprecated Use validateCertificationLinks */
export const normalizeCertificationLinks = (value: string | null | undefined): string | null => {
  const result = validateCertificationLinks(value);
  if (!result.ok) return null;
  return result.value;
};

export const validateOptionalUrl = (value: string | null | undefined): string | null => {
  if (value == null || value.trim() === "") return null;
  if (!isValidUrl(value)) return null;
  return normalizeUrl(value);
};

export const validateRequiredUrl = (value: string): { ok: true; value: string } | { ok: false } => {
  if (!isValidUrl(value)) return { ok: false };
  return { ok: true, value: normalizeUrl(value) };
};

/** Detect URL-like values for admin link rendering (including normalized storage). */
export const isUrlLike = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (PROTOCOL_PATTERN.test(trimmed)) return true;
  return /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(trimmed);
};

export const toClickableHref = (value: string): string =>
  PROTOCOL_PATTERN.test(sanitizeUrlInput(value))
    ? sanitizeUrlInput(value)
    : normalizeUrl(value);
