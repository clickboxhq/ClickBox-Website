// In-memory rate limiter with TTL.
// For multi-instance production, replace store with Upstash Redis.

const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number,
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return false; // not rate limited
  }

  if (entry.count >= maxRequests) return true; // rate limited

  entry.count++;
  return false;
}
