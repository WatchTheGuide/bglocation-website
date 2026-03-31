// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { generateKeyPairSync } from "node:crypto";

import { isValidBundleId, generateLicenseKey } from "../license";

// Generate a real RSA key pair for testing
const { privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
});

beforeEach(() => {
  process.env.RSA_PRIVATE_KEY = privateKey;
});

afterEach(() => {
  delete process.env.RSA_PRIVATE_KEY;
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("isValidBundleId", () => {
  it("should accept a valid reverse-domain bundle ID", () => {
    expect(isValidBundleId("com.example.app")).toBe(true);
  });

  it("should accept a two-segment bundle ID", () => {
    expect(isValidBundleId("com.app")).toBe(true);
  });

  it("should accept bundle IDs with numbers", () => {
    expect(isValidBundleId("com.example.app123")).toBe(true);
  });

  it("should reject a single-segment ID", () => {
    expect(isValidBundleId("myapp")).toBe(false);
  });

  it("should reject an empty string", () => {
    expect(isValidBundleId("")).toBe(false);
  });

  it("should reject a segment starting with a digit", () => {
    expect(isValidBundleId("com.1bad.app")).toBe(false);
  });

  it("should reject IDs longer than 255 characters", () => {
    const long = "com." + "a".repeat(252);
    expect(isValidBundleId(long)).toBe(false);
  });

  it("should reject IDs with special characters", () => {
    expect(isValidBundleId("com.example.my-app")).toBe(false);
  });
});

describe("generateLicenseKey", () => {
  it("should return a key starting with BGL1-", () => {
    const { licenseKey } = generateLicenseKey("com.example.app");
    expect(licenseKey).toMatch(/^BGL1-/);
  });

  it("should contain payload and signature separated by dot", () => {
    const { licenseKey } = generateLicenseKey("com.example.app");
    const withoutPrefix = licenseKey.replace("BGL1-", "");
    const parts = withoutPrefix.split(".");
    expect(parts).toHaveLength(2);
    expect(parts[0].length).toBeGreaterThan(0);
    expect(parts[1].length).toBeGreaterThan(0);
  });

  it("should embed the bundle ID in the payload", () => {
    const { licenseKey } = generateLicenseKey("com.test.license");
    const payloadB64 = licenseKey.replace("BGL1-", "").split(".")[0];
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString(),
    );
    expect(payload.bid).toBe("com.test.license");
  });

  it("should set issuedAt close to now", () => {
    const before = Math.floor(Date.now() / 1000);
    const { issuedAt } = generateLicenseKey("com.example.app");
    const after = Math.floor(Date.now() / 1000);

    const iat = Math.floor(issuedAt.getTime() / 1000);
    expect(iat).toBeGreaterThanOrEqual(before);
    expect(iat).toBeLessThanOrEqual(after);
  });

  it("should set updatesUntil to 365 days after issuedAt", () => {
    const { issuedAt, updatesUntil } = generateLicenseKey("com.example.app");
    const diff =
      (updatesUntil.getTime() - issuedAt.getTime()) / 1000 / 60 / 60 / 24;
    expect(diff).toBe(365);
  });

  it("should throw when RSA_PRIVATE_KEY is not set", () => {
    delete process.env.RSA_PRIVATE_KEY;
    expect(() => generateLicenseKey("com.example.app")).toThrow(
      "RSA_PRIVATE_KEY environment variable is not set",
    );
  });
});
