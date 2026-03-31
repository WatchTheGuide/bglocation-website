// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";

// We need to reset the global singleton between tests.
// Each rate limiter uses a unique Symbol.for key on globalThis.
function clearGlobalRateLimiter(symbolKey: string) {
  const key = Symbol.for(symbolKey);
  const g = globalThis as unknown as Record<symbol, unknown>;
  const entry = g[key] as
    | { requests: Map<string, number[]>; interval: ReturnType<typeof setInterval> }
    | undefined;
  if (entry) {
    entry.requests.clear();
  }
}

describe("chat/rate-limiter (checkRateLimit)", () => {
  beforeEach(() => {
    clearGlobalRateLimiter("bglocation-rate-limiter");
    vi.restoreAllMocks();
  });

  it("should allow requests within the limit (5 per hour)", async () => {
    const { checkRateLimit } = await import("@/lib/chat/rate-limiter");
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("1.2.3.4")).toBe(true);
    }
  });

  it("should block the 6th request from the same IP", async () => {
    const { checkRateLimit } = await import("@/lib/chat/rate-limiter");
    for (let i = 0; i < 5; i++) checkRateLimit("1.2.3.4");
    expect(checkRateLimit("1.2.3.4")).toBe(false);
  });

  it("should allow requests from different IPs independently", async () => {
    const { checkRateLimit } = await import("@/lib/chat/rate-limiter");
    for (let i = 0; i < 5; i++) checkRateLimit("1.1.1.1");
    expect(checkRateLimit("1.1.1.1")).toBe(false);
    expect(checkRateLimit("2.2.2.2")).toBe(true);
  });

  it("should allow requests again after the time window expires", async () => {
    const { checkRateLimit } = await import("@/lib/chat/rate-limiter");
    const realNow = Date.now;
    let fakeNow = realNow.call(Date);

    vi.spyOn(Date, "now").mockImplementation(() => fakeNow);

    for (let i = 0; i < 5; i++) checkRateLimit("1.2.3.4");
    expect(checkRateLimit("1.2.3.4")).toBe(false);

    // Advance past 1 hour window
    fakeNow += 60 * 60 * 1000 + 1;
    expect(checkRateLimit("1.2.3.4")).toBe(true);
  });
});

describe("newsletter/rate-limiter (checkNewsletterRateLimit)", () => {
  beforeEach(() => {
    clearGlobalRateLimiter("bglocation-newsletter-rate-limiter");
    vi.restoreAllMocks();
  });

  it("should allow requests within the limit (3 per minute)", async () => {
    const { checkNewsletterRateLimit } = await import(
      "@/lib/newsletter/rate-limiter"
    );
    for (let i = 0; i < 3; i++) {
      expect(checkNewsletterRateLimit("10.0.0.1")).toBe(true);
    }
  });

  it("should block the 4th request from the same IP", async () => {
    const { checkNewsletterRateLimit } = await import(
      "@/lib/newsletter/rate-limiter"
    );
    for (let i = 0; i < 3; i++) checkNewsletterRateLimit("10.0.0.1");
    expect(checkNewsletterRateLimit("10.0.0.1")).toBe(false);
  });

  it("should allow requests again after the time window expires", async () => {
    const { checkNewsletterRateLimit } = await import(
      "@/lib/newsletter/rate-limiter"
    );
    const realNow = Date.now;
    let fakeNow = realNow.call(Date);

    vi.spyOn(Date, "now").mockImplementation(() => fakeNow);

    for (let i = 0; i < 3; i++) checkNewsletterRateLimit("10.0.0.1");
    expect(checkNewsletterRateLimit("10.0.0.1")).toBe(false);

    // Advance past 1 minute window
    fakeNow += 60 * 1000 + 1;
    expect(checkNewsletterRateLimit("10.0.0.1")).toBe(true);
  });
});

describe("http-test/rate-limiter (checkHttpTestRateLimit)", () => {
  beforeEach(() => {
    clearGlobalRateLimiter("bglocation-http-test-rate-limiter");
    vi.restoreAllMocks();
  });

  it("should allow requests within the limit (300 per minute)", async () => {
    const { checkHttpTestRateLimit } = await import(
      "@/lib/http-test/rate-limiter"
    );
    for (let i = 0; i < 300; i++) {
      expect(checkHttpTestRateLimit("192.168.0.1")).toBe(true);
    }
  });

  it("should block the 301st request from the same IP", async () => {
    const { checkHttpTestRateLimit } = await import(
      "@/lib/http-test/rate-limiter"
    );
    for (let i = 0; i < 300; i++) checkHttpTestRateLimit("192.168.0.1");
    expect(checkHttpTestRateLimit("192.168.0.1")).toBe(false);
  });
});
