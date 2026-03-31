// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/http-test/rate-limiter", () => ({
  checkHttpTestRateLimit: vi.fn().mockReturnValue(true),
}));

vi.mock("@/lib/http-test/file-logger", () => ({
  logHttpTestRequest: vi.fn().mockResolvedValue(undefined),
}));

import { GET, POST, OPTIONS } from "../route";
import { checkHttpTestRateLimit } from "@/lib/http-test/rate-limiter";

function makePostRequest(
  body: unknown,
  headers: Record<string, string> = {}
) {
  const json = JSON.stringify(body);
  return new Request("http://localhost/api/http-test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "content-length": String(json.length),
      ...headers,
    },
    body: json,
  });
}

describe("/api/http-test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.HTTP_TEST_SECRET;
    (checkHttpTestRateLimit as ReturnType<typeof vi.fn>).mockReturnValue(true);
  });

  describe("OPTIONS", () => {
    it("should return 204 with CORS headers", async () => {
      const res = await OPTIONS();
      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    });
  });

  describe("GET", () => {
    it("should return endpoint documentation", async () => {
      const res = await GET();
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.endpoint).toBe("/api/http-test");
    });
  });

  describe("POST", () => {
    it("should accept a valid location payload", async () => {
      const res = await POST(
        makePostRequest({
          location: {
            latitude: 52.22,
            longitude: 21.01,
            accuracy: 5,
            timestamp: 1700000000000,
          },
        })
      );
      const json = await res.json();
      expect(json.received).toBe(true);
      expect(json.success).toBe(true);
      expect(json.locationCount).toBe(1);
      expect(json.shape).toBe("location-wrapper");
    });

    it("should return 429 when rate limited", async () => {
      (checkHttpTestRateLimit as ReturnType<typeof vi.fn>).mockReturnValue(false);

      const res = await POST(makePostRequest({ foo: "bar" }));
      expect(res.status).toBe(429);
    });

    it("should return 401 when secret is configured but missing from request", async () => {
      process.env.HTTP_TEST_SECRET = "my-secret";

      const res = await POST(makePostRequest({ foo: "bar" }));
      expect(res.status).toBe(401);
    });

    it("should accept request with correct secret", async () => {
      process.env.HTTP_TEST_SECRET = "my-secret";

      const res = await POST(
        makePostRequest({ foo: "bar" }, { authorization: "Bearer my-secret" })
      );
      const json = await res.json();
      expect(json.received).toBe(true);
      expect(json.success).toBe(true);
    });

    it("should return 400 for invalid JSON with arrived=true", async () => {
      const req = new Request("http://localhost/api/http-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "content-length": "11",
        },
        body: "{invalid!!!",
      });
      const res = await POST(req);
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.received).toBe(true);
      expect(json.arrived).toBe(true);
      expect(json.success).toBe(false);
    });

    it("should return 413 for body exceeding limit", async () => {
      const largeBody = JSON.stringify({ data: "x".repeat(70000) });
      const req = new Request("http://localhost/api/http-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "content-length": String(largeBody.length),
        },
        body: largeBody,
      });
      const res = await POST(req);
      expect(res.status).toBe(413);
    });

    it("should detect single location shape", async () => {
      const res = await POST(
        makePostRequest({
          latitude: 52.22,
          longitude: 21.01,
        })
      );
      const json = await res.json();
      expect(json.shape).toBe("single-location");
      expect(json.locationCount).toBe(1);
    });

    it("should detect locations array shape", async () => {
      const res = await POST(
        makePostRequest({
          locations: [
            { latitude: 52.22, longitude: 21.01 },
            { latitude: 52.23, longitude: 21.02 },
          ],
        })
      );
      const json = await res.json();
      expect(json.shape).toBe("locations-array");
      expect(json.locationCount).toBe(2);
    });
  });
});
