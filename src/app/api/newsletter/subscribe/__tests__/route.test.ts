// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFindUnique = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    subscriber: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      create: (...args: unknown[]) => mockCreate(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/emails/confirm-subscription", () => ({
  ConfirmSubscriptionEmail: () => null,
}));

vi.mock("@/lib/newsletter/rate-limiter", () => ({
  checkNewsletterRateLimit: vi.fn().mockReturnValue(true),
}));

vi.mock("@/lib/newsletter/cleanup", () => ({
  cleanupStaleSubscribers: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "../route";
import { checkNewsletterRateLimit } from "@/lib/newsletter/rate-limiter";
import { sendEmail } from "@/lib/email";

const BASE_URL = "https://bglocation.dev";

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/newsletter/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: BASE_URL,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/newsletter/subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = BASE_URL;
    (checkNewsletterRateLimit as ReturnType<typeof vi.fn>).mockReturnValue(true);
  });

  it("should return 403 when origin header is missing", async () => {
    const req = new Request("http://localhost/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.com" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("should return 403 when origin does not match", async () => {
    const req = makeRequest(
      { email: "a@b.com", consent: "yes" },
      { origin: "https://evil.com" }
    );
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("should return 429 when rate limited", async () => {
    (checkNewsletterRateLimit as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const req = makeRequest(
      { email: "a@b.com", consent: "yes" },
      { "x-forwarded-for": "1.2.3.4" }
    );
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it("should return 400 for invalid email", async () => {
    const res = await POST(makeRequest({ email: "not-email", consent: "yes" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid email" });
  });

  it("should return 400 when consent is missing", async () => {
    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Consent is required" });
  });

  it("should silently succeed for honeypot trap", async () => {
    const res = await POST(
      makeRequest({
        email: "bot@spam.com",
        consent: "yes",
        website: "http://spam.com",
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "Check your email to confirm",
    });
    // Should NOT create a subscriber
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should create new subscriber and send confirmation email", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({});

    const res = await POST(
      makeRequest({
        email: "NEW@Example.com",
        consent: "I agree",
        source: "footer",
        platforms: ["capacitor"],
      })
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "Check your email to confirm",
    });

    // Email should be normalized to lowercase
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "new@example.com",
          status: "pending",
          platforms: ["capacitor"],
          source: "footer",
        }),
      })
    );

    expect(sendEmail).toHaveBeenCalled();
  });

  it("should return same success message for already confirmed subscriber", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      status: "confirmed",
    });

    const res = await POST(
      makeRequest({ email: "user@example.com", consent: "yes" })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "Check your email to confirm",
    });
    // Should NOT update or create
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should re-subscribe for pending subscriber", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      status: "pending",
      unsubToken: "existing-unsub-token",
    });
    mockUpdate.mockResolvedValue({});

    const res = await POST(
      makeRequest({ email: "user@example.com", consent: "I agree again" })
    );

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({
          status: "pending",
        }),
      })
    );
    expect(sendEmail).toHaveBeenCalled();
  });
});
