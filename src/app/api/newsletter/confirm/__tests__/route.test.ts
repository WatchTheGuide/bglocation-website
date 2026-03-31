// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFindUnique = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    subscriber: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

import { POST } from "../route";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/newsletter/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/newsletter/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 for invalid JSON", async () => {
    const req = new Request("http://localhost/api/newsletter/confirm", {
      method: "POST",
      body: "not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 400 when token is missing", async () => {
    const res = await POST(makeRequest({ foo: "bar" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Token is required" });
  });

  it("should return 400 for invalid token (not found in DB)", async () => {
    mockFindUnique.mockResolvedValue(null);

    const res = await POST(makeRequest({ token: "invalid-token" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid or expired token" });
  });

  it("should return success for already confirmed subscriber", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      status: "confirmed",
    });

    const res = await POST(makeRequest({ token: "valid-token" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Already confirmed" });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("should return 410 for expired token", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      status: "pending",
      confirmTokenExpiresAt: new Date("2020-01-01"),
    });

    const res = await POST(makeRequest({ token: "expired-token" }));
    expect(res.status).toBe(410);
  });

  it("should confirm a pending subscriber", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      status: "pending",
      confirmTokenExpiresAt: new Date(Date.now() + 86400000),
    });
    mockUpdate.mockResolvedValue({});

    const res = await POST(makeRequest({ token: "valid-token" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Subscription confirmed" });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({
          status: "confirmed",
          confirmToken: null,
        }),
      })
    );
  });
});
