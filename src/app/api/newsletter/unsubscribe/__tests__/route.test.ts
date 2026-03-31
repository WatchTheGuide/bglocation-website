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

function makeRequest(body: unknown, url = "http://localhost/api/newsletter/unsubscribe") {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/newsletter/unsubscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should accept token from query string (RFC 8058)", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      status: "confirmed",
    });
    mockUpdate.mockResolvedValue({});

    const req = new Request(
      "http://localhost/api/newsletter/unsubscribe?token=query-token",
      { method: "POST" }
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { unsubToken: "query-token" },
    });
  });

  it("should accept token from JSON body", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      status: "confirmed",
    });
    mockUpdate.mockResolvedValue({});

    const res = await POST(makeRequest({ token: "body-token" }));
    expect(res.status).toBe(200);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { unsubToken: "body-token" },
    });
  });

  it("should return 400 for invalid token (not found)", async () => {
    mockFindUnique.mockResolvedValue(null);

    const res = await POST(makeRequest({ token: "bad-token" }));
    expect(res.status).toBe(400);
  });

  it("should return success for already unsubscribed", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      status: "unsubscribed",
    });

    const res = await POST(makeRequest({ token: "unsub-token" }));
    const json = await res.json();
    expect(json).toEqual({ message: "Already unsubscribed" });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("should unsubscribe a confirmed subscriber", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      status: "confirmed",
    });
    mockUpdate.mockResolvedValue({});

    const res = await POST(makeRequest({ token: "valid-token" }));
    expect(await res.json()).toEqual({ message: "Successfully unsubscribed" });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({
          status: "unsubscribed",
          confirmToken: null,
        }),
      })
    );
  });
});
