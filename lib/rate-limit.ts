/**
 * Simple in-memory sliding window rate limiter.
 * Resets on server restart / cold start — suitable for early-stage apps.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimiter {
  check: (key: string) => { success: boolean; remaining: number };
}

/**
 * Create a rate limiter with a fixed window.
 * @param maxRequests Maximum requests allowed in the window
 * @param windowMs Window duration in milliseconds
 * @param prefix Key prefix to namespace different limiters
 */
export function createRateLimiter(
  maxRequests: number,
  windowMs: number,
  prefix: string
): RateLimiter {
  return {
    check(key: string) {
      const fullKey = `${prefix}:${key}`;
      const now = Date.now();
      const entry = store.get(fullKey);

      if (!entry || now > entry.resetAt) {
        store.set(fullKey, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: maxRequests - 1 };
      }

      if (entry.count >= maxRequests) {
        return { success: false, remaining: 0 };
      }

      entry.count++;
      return { success: true, remaining: maxRequests - entry.count };
    },
  };
}

// Pre-configured limiters
/** General API: 60 requests per minute per user */
export const apiLimiter = createRateLimiter(60, 60_000, "api");

/** Auth endpoints: 10 requests per minute per IP */
export const authLimiter = createRateLimiter(10, 60_000, "auth");

/** Invitations: 5 per hour per user */
export const inviteLimiter = createRateLimiter(5, 3_600_000, "invite");

/** Public biodata submissions: 3 per IP per 24 hours */
export const submissionLimiter = createRateLimiter(3, 24 * 3_600_000, "submission");
