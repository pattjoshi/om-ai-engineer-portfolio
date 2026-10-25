// Lightweight in-memory rate limiter for /api/chat.
//
// This guards against a single client hammering the endpoint and running up
// the Mistral/Groq bill. It's in-memory (per warm serverless instance), so it
// won't perfectly catch a distributed attack spread across many cold-started
// lambdas — for that, a shared store (e.g. Upstash Redis) would be needed.
// For a portfolio-scale site this is a reasonable, zero-cost first line of
// defense against the common case: one abusive client/script spamming fast.

const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 8; // ~1 request every 7.5s sustained
const MAX_BURST = 3; // hard cap on requests within a 10s burst
const BURST_MS = 10_000;

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

// Periodically drop stale buckets so the Map doesn't grow unbounded on a
// long-lived warm instance.
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < WINDOW_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  }
}

export function getClientKey(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export type RateLimitResult =
  | { limited: false }
  | { limited: true; retryAfterSeconds: number };

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

  const burstCount = bucket.timestamps.filter((t) => now - t < BURST_MS).length;
  if (burstCount >= MAX_BURST) {
    buckets.set(key, bucket);
    return { limited: true, retryAfterSeconds: Math.ceil(BURST_MS / 1000) };
  }

  if (bucket.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = bucket.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
    buckets.set(key, bucket);
    return { limited: true, retryAfterSeconds };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { limited: false };
}
