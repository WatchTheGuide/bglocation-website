import { describe, it, expect } from "vitest";
import {
  isFramework,
  normalizeFrameworkQueryValue,
  resolveFrameworkQuery,
  getFrameworkOption,
  withFrameworkHref,
  shouldUseFrameworkMenuMode,
} from "../framework";

describe("isFramework", () => {
  it("should accept 'capacitor'", () => {
    expect(isFramework("capacitor")).toBe(true);
  });

  it("should accept 'react-native'", () => {
    expect(isFramework("react-native")).toBe(true);
  });

  it("should reject unknown values", () => {
    expect(isFramework("flutter")).toBe(false);
    expect(isFramework("")).toBe(false);
    expect(isFramework(null)).toBe(false);
    expect(isFramework(undefined)).toBe(false);
  });
});

describe("normalizeFrameworkQueryValue", () => {
  it("should trim whitespace", () => {
    expect(normalizeFrameworkQueryValue("  capacitor  ")).toBe("capacitor");
  });

  it("should lowercase", () => {
    expect(normalizeFrameworkQueryValue("React-Native")).toBe("react-native");
  });

  it("should replace spaces and underscores with hyphens", () => {
    expect(normalizeFrameworkQueryValue("react native")).toBe("react-native");
    expect(normalizeFrameworkQueryValue("react_native")).toBe("react-native");
  });
});

describe("resolveFrameworkQuery", () => {
  it("should return null for null/undefined", () => {
    expect(resolveFrameworkQuery(null)).toBeNull();
    expect(resolveFrameworkQuery(undefined)).toBeNull();
  });

  it("should return null for empty string", () => {
    expect(resolveFrameworkQuery("")).toBeNull();
  });

  it("should match exact values", () => {
    expect(resolveFrameworkQuery("capacitor")).toBe("capacitor");
    expect(resolveFrameworkQuery("react-native")).toBe("react-native");
  });

  it("should match with normalization", () => {
    expect(resolveFrameworkQuery("  Capacitor  ")).toBe("capacitor");
    expect(resolveFrameworkQuery("React_Native")).toBe("react-native");
  });

  it("should match by prefix", () => {
    expect(resolveFrameworkQuery("react-nativ")).toBe("react-native");
    expect(resolveFrameworkQuery("cap")).toBe("capacitor");
  });

  it("should match by Levenshtein fuzzy match (distance ≤ 2)", () => {
    expect(resolveFrameworkQuery("capacitr")).toBe("capacitor");
    expect(resolveFrameworkQuery("capacitro")).toBe("capacitor");
  });

  it("should return null for unknown values (distance > 2)", () => {
    expect(resolveFrameworkQuery("flutter")).toBeNull();
    expect(resolveFrameworkQuery("xyz")).toBeNull();
  });
});

describe("getFrameworkOption", () => {
  it("should return capacitor option", () => {
    const option = getFrameworkOption("capacitor");
    expect(option.value).toBe("capacitor");
    expect(option.label).toBe("Capacitor");
  });

  it("should return react-native option", () => {
    const option = getFrameworkOption("react-native");
    expect(option.value).toBe("react-native");
    expect(option.label).toBe("React Native");
  });
});

describe("withFrameworkHref", () => {
  it("should add ?framework= to internal URLs", () => {
    expect(withFrameworkHref("/docs", "capacitor")).toBe(
      "/docs?framework=capacitor",
    );
    expect(withFrameworkHref("/pricing", "react-native")).toBe(
      "/pricing?framework=react-native",
    );
  });

  it("should preserve existing path and hash", () => {
    expect(withFrameworkHref("/docs#api", "capacitor")).toBe(
      "/docs?framework=capacitor#api",
    );
  });

  it("should not modify external URLs", () => {
    expect(withFrameworkHref("https://example.com", "capacitor")).toBe(
      "https://example.com",
    );
  });
});

describe("shouldUseFrameworkMenuMode", () => {
  it("should return false when there are exactly 2 primary options and no planned", () => {
    // Currently FRAMEWORK_OPTIONS has exactly 2, PLANNED_FRAMEWORK_OPTIONS is empty
    expect(shouldUseFrameworkMenuMode()).toBe(false);
  });
});
