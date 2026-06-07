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

// ─── Advanced URL Security Checks (Layer 10) ─────────────────────────────────

/**
 * Detect URLs that embed credentials (user:pass@host).
 * These are a security risk and should be rejected.
 */
export const hasEmbeddedCredentials = (url: string): boolean => {
  try {
    const parsed = new URL(normalizeUrl(url));
    return !!(parsed.username || parsed.password);
  } catch {
    return false;
  }
};

/**
 * Detect open redirect parameters in a URL.
 * Helps catch phishing attempts that use a trusted domain as a redirect proxy.
 */
export const isOpenRedirect = (url: string): boolean => {
  const REDIRECT_PARAMS = ["url", "redirect", "return", "next", "goto", "returnUrl", "redir"];
  try {
    const parsed = new URL(normalizeUrl(url));
    return REDIRECT_PARAMS.some((p) => parsed.searchParams.has(p));
  } catch {
    return false;
  }
};

// ─── Resume URL Validation (Layer 6) ─────────────────────────────────────────

export const ALLOWED_RESUME_DOMAINS = [
  "linkedin.com",
  "www.linkedin.com",
  "drive.google.com",
  "docs.google.com",
  "dropbox.com",
  "www.dropbox.com",
  "notion.so",
  "www.notion.so",
  "github.com",
  "www.github.com",
  "read.cv",
  "www.read.cv",
  "portfolio.adobe.com",
] as const;

export type ResumeUrlResult =
  | { valid: true; sanitized: string; domain: string }
  | { valid: false; error: string };

const TRACKING_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "ref"];

/** Strip common tracking query parameters from a URL. */
export const stripTrackingParams = (url: string): string => {
  try {
    const parsed = new URL(normalizeUrl(url));
    TRACKING_PARAMS.forEach((p) => parsed.searchParams.delete(p));
    return parsed.toString();
  } catch {
    return url;
  }
};

/**
 * Full validation for resume/portfolio URLs.
 * - Must be HTTPS
 * - Domain must be in the allowlist
 * - No embedded credentials
 * - Max 500 chars
 */
export const validateResumeUrl = (url: string): ResumeUrlResult => {
  const trimmed = url.trim();

  if (!trimmed) return { valid: false, error: "Resume link is required." };
  if (trimmed.length > 500) return { valid: false, error: "Resume link is too long (max 500 characters)." };
  if (hasEmbeddedCredentials(trimmed)) return { valid: false, error: "Resume link must not contain credentials." };

  let parsed: URL;
  try {
    parsed = new URL(normalizeUrl(trimmed));
  } catch {
    return { valid: false, error: "Resume link is not a valid URL." };
  }

  if (parsed.protocol !== "https:") {
    return { valid: false, error: "Resume link must use HTTPS." };
  }

  const allowed = ALLOWED_RESUME_DOMAINS.some(
    (d) => parsed.hostname === d || parsed.hostname.endsWith("." + d),
  );

  if (!allowed) {
    return {
      valid: false,
      error:
        "Resume link must be from LinkedIn, Google Drive, Dropbox, Notion, GitHub, or Read.cv.",
    };
  }

  const sanitized = stripTrackingParams(trimmed);
  return { valid: true, sanitized, domain: parsed.hostname };
};
