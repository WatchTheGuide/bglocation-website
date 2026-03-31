// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import {
  createMagicLinkToken,
  verifyMagicLinkToken,
  createSessionToken,
  createAdminMagicLinkToken,
  verifyAdminMagicLinkToken,
  createAdminSessionToken,
} from "../auth";

const TEST_SECRET = "test-secret-at-least-32-chars-long!!";

beforeEach(() => {
  process.env.AUTH_SECRET = TEST_SECRET;
});

afterEach(() => {
  delete process.env.AUTH_SECRET;
  vi.clearAllMocks();
});

describe("createMagicLinkToken / verifyMagicLinkToken", () => {
  it("should create a valid token and verify it", async () => {
    const token = await createMagicLinkToken("user@test.com", "cust_123");
    const result = await verifyMagicLinkToken(token);

    expect(result).toEqual({
      email: "user@test.com",
      customerId: "cust_123",
    });
  });

  it("should reject a tampered token", async () => {
    const token = await createMagicLinkToken("user@test.com", "cust_123");
    const result = await verifyMagicLinkToken(token + "tampered");

    expect(result).toBeNull();
  });

  it("should reject a session token used as magic link token", async () => {
    const token = await createSessionToken("cust_123", "user@test.com");
    const result = await verifyMagicLinkToken(token);

    expect(result).toBeNull();
  });
});

describe("createSessionToken", () => {
  it("should create a token that can be verified via jose", async () => {
    const { jwtVerify } = await import("jose");
    const token = await createSessionToken("cust_123", "user@test.com");
    const secret = new TextEncoder().encode(TEST_SECRET);
    const { payload } = await jwtVerify(token, secret);

    expect(payload.customerId).toBe("cust_123");
    expect(payload.email).toBe("user@test.com");
    expect(payload.type).toBe("session");
  });
});

describe("createAdminMagicLinkToken / verifyAdminMagicLinkToken", () => {
  it("should create a valid admin magic token and verify it", async () => {
    const token = await createAdminMagicLinkToken(
      "admin@test.com",
      "admin_123",
    );
    const result = await verifyAdminMagicLinkToken(token);

    expect(result).toEqual({
      email: "admin@test.com",
      adminId: "admin_123",
    });
  });

  it("should reject a portal magic token used for admin verification", async () => {
    const token = await createMagicLinkToken("user@test.com", "cust_123");
    const result = await verifyAdminMagicLinkToken(token);

    expect(result).toBeNull();
  });
});

describe("createAdminSessionToken", () => {
  it("should create a token with admin-session type", async () => {
    const { jwtVerify } = await import("jose");
    const token = await createAdminSessionToken("admin_123", "admin@test.com");
    const secret = new TextEncoder().encode(TEST_SECRET);
    const { payload } = await jwtVerify(token, secret);

    expect(payload.adminId).toBe("admin_123");
    expect(payload.email).toBe("admin@test.com");
    expect(payload.type).toBe("admin-session");
  });
});

describe("getSecret", () => {
  it("should throw when AUTH_SECRET is not set", async () => {
    delete process.env.AUTH_SECRET;

    await expect(
      createMagicLinkToken("user@test.com", "cust_123"),
    ).rejects.toThrow("AUTH_SECRET environment variable is not set");
  });
});
