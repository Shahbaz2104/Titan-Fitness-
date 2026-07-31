import { headers } from "next/headers";

type RateLimitStore = Map<string, { count: number; resetAt: number }>;

const store: RateLimitStore = new Map();

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

const DEFAULTS: RateLimitOptions = {
  windowMs: 60_000,
  max: 60,
};

/**
 * Sliding-window in-memory rate limiter.
 * For multi-instance deployments swap with Redis.
 */
export async function rateLimit(
  identifier: string,
  options?: Partial<RateLimitOptions>
): Promise<RateLimitResult> {
  const { windowMs, max } = { ...DEFAULTS, ...options };
  const now = Date.now();

  const key = `${identifier}:${Math.floor(now / windowMs)}`;
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (entry.resetAt < now) {
    store.delete(key);
    return rateLimit(identifier, options);
  }

  if (entry.count >= max) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

/** Convenience: derive an identifier from the incoming request. */
export async function rateLimitByIp(
  limit = 60,
  windowMs = 60_000
): Promise<RateLimitResult> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";
  return rateLimit(`ip:${ip}`, { max: limit, windowMs });
}

export async function rateLimitByUser(
  userId: string,
  limit = 30,
  windowMs = 60_000
): Promise<RateLimitResult> {
  return rateLimit(`user:${userId}`, { max: limit, windowMs });
}

export async function rateLimitByEmail(
  email: string,
  limit = 5,
  windowMs = 60_000
): Promise<RateLimitResult> {
  return rateLimit(`email:${email.toLowerCase()}`, { max: limit, windowMs });
}
