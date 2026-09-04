/**
 * External product & platform links.
 *
 * Single source of truth so the ThreatLens URL is never hardcoded in more than
 * one place. Override per-environment with `VITE_THREATLENS_URL` (see
 * `.env.example`); the fallback is the current production URL.
 */
export const THREATLENS_URL =
  import.meta.env.VITE_THREATLENS_URL?.trim() || "https://threatlensapp.com";

/** Attributes for an external link that opens in a new, isolated tab. */
export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
