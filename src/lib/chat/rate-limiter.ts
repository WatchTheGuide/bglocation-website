const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const globalKey = Symbol.for("bglocation-rate-limiter");
const g = globalThis as unknown as Record<symbol, { requests: Map<string, number[]>; interval: ReturnType<typeof setInterval> }>;

if (!g[globalKey]) {
  const requests = new Map<string, number[]>();
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requests) {
      const valid = timestamps.filter((t) => now - t < WINDOW_MS);
      if (valid.length === 0) {
        requests.delete(ip);
      } else {
        requests.set(ip, valid);
      }
    }
  }, CLEANUP_INTERVAL_MS);
  interval.unref();
  g[globalKey] = { requests, interval };
}

const { requests } = g[globalKey];

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requests.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS,
  );

  if (timestamps.length >= MAX_REQUESTS) return false;

  timestamps.push(now);
  requests.set(ip, timestamps);
  return true;
}
