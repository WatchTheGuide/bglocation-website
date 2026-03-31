// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock jose before middleware import
vi.mock("jose", () => ({
  jwtVerify: vi.fn(),
}));

// Mock framework lib (pure, no need to reset)
vi.mock("@/lib/framework", () => ({
  FRAMEWORK_QUERY_PARAM: "framework",
  resolveFrameworkQuery: (v: string | null) =>
    v === "capacitor" || v === "react-native" ? v : null,
}));

import { middleware } from "../middleware";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

const mockJwtVerify = jwtVerify as ReturnType<typeof vi.fn>;

function makeRequest(
  path: string,
  options?: { cookies?: Record<string, string>; query?: Record<string, string> }
) {
  const url = new URL(path, "http://localhost");
  if (options?.query) {
    for (const [k, v] of Object.entries(options.query)) {
      url.searchParams.set(k, v);
    }
  }
  const req = new NextRequest(url);
  if (options?.cookies) {
    for (const [k, v] of Object.entries(options.cookies)) {
      req.cookies.set(k, v);
    }
  }
  return req;
}

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AUTH_SECRET = "test-secret-at-least-32-chars-long!!";
  });

  describe("Portal auth", () => {
    it("should allow /portal/login without auth", async () => {
      const res = await middleware(makeRequest("/portal/login"));
      expect(res.status).toBe(200);
    });

    it("should redirect to login when missing session cookie", async () => {
      const res = await middleware(makeRequest("/portal/dashboard"));
      expect(res.status).toBe(307);
      expect(new URL(res.headers.get("location")!).pathname).toBe(
        "/portal/login"
      );
    });

    it("should allow access with valid session token", async () => {
      mockJwtVerify.mockResolvedValue({
        payload: { type: "session" },
      });

      const res = await middleware(
        makeRequest("/portal/dashboard", {
          cookies: { bgl_session: "valid-token" },
        })
      );
      expect(res.status).toBe(200);
    });

    it("should redirect and clear cookie for invalid session token", async () => {
      mockJwtVerify.mockRejectedValue(new Error("invalid"));

      const res = await middleware(
        makeRequest("/portal/dashboard", {
          cookies: { bgl_session: "bad-token" },
        })
      );
      expect(res.status).toBe(307);
      expect(new URL(res.headers.get("location")!).pathname).toBe(
        "/portal/login"
      );
    });
  });

  describe("Admin auth", () => {
    it("should allow /admin/login without auth", async () => {
      const res = await middleware(makeRequest("/admin/login"));
      expect(res.status).toBe(200);
    });

    it("should redirect to login when missing admin session", async () => {
      const res = await middleware(makeRequest("/admin/dashboard"));
      expect(res.status).toBe(307);
      expect(new URL(res.headers.get("location")!).pathname).toBe(
        "/admin/login"
      );
    });

    it("should allow access with valid admin token", async () => {
      mockJwtVerify.mockResolvedValue({
        payload: { type: "admin-session" },
      });

      const res = await middleware(
        makeRequest("/admin/dashboard", {
          cookies: { bgl_admin_session: "valid-admin-token" },
        })
      );
      expect(res.status).toBe(200);
    });
  });

  describe("Framework header", () => {
    it("should set x-bgl-framework header for valid framework query", async () => {
      const res = await middleware(
        makeRequest("/docs", { query: { framework: "react-native" } })
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-request-x-bgl-framework")).toBe(
        "react-native"
      );
    });

    it("should not set header for invalid framework query", async () => {
      const res = await middleware(
        makeRequest("/docs", { query: { framework: "flutter" } })
      );
      expect(res.status).toBe(200);
      expect(
        res.headers.get("x-middleware-request-x-bgl-framework")
      ).toBeNull();
    });
  });
});
