const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const requests = new Map<string, number[]>();

const cleanupInterval = setInterval(() => {
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
cleanupInterval.unref();

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
