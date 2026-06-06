/**
 * Flexible URL validation for fellowship and contact forms.
 * Accepts URLs with or without a protocol and normalizes to https:// for storage.
 */

const PROTOCOL_PATTERN = /^https?:\/\//i;

export const normalizeUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return PROTOCOL_PATTERN.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export const isValidUrl = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const parsed = new URL(normalizeUrl(trimmed));
    if (!parsed.hostname || !parsed.hostname.includes(".")) return false;
    if (parsed.hostname === "localhost") return true;
    return parsed.hostname.length > 0;
  } catch {
    return false;
  }
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

/** Split multiline certification link fields and normalize each valid URL. */
export const normalizeCertificationLinks = (value: string | null | undefined): string | null => {
  if (value == null || value.trim() === "") return null;

  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  const normalized: string[] = [];
  for (const line of lines) {
    if (!isValidUrl(line)) return null;
    normalized.push(normalizeUrl(line));
  }

  return normalized.join("\n");
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
  PROTOCOL_PATTERN.test(value.trim()) ? value.trim() : normalizeUrl(value);
