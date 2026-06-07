export function sanitizeText(input: string, maxLen = 5000): string {
  return String(input)
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLen);
}

export function sanitizeEmail(input: string): string {
  return String(input).toLowerCase().trim().slice(0, 255);
}

const INJECTION_PATTERNS = [
  /(\bSELECT\b|\bINSERT\b|\bDROP\b|\bUPDATE\b|\bDELETE\b|\bUNION\b|\bEXEC\b)/i,
  /<script[\s\S]*?>/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /\{\{.*?\}\}/,
  /\$\{.*?\}/,
];

export function detectInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((p) => p.test(input));
}

export function isSpam(input: string): boolean {
  const words = input.toLowerCase().split(/\s+/);
  if (words.length < 20) return false;
  const unique = new Set(words);
  return unique.size / words.length < 0.3;
}
