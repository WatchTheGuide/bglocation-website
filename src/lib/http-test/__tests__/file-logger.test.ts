// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  appendFile: vi.fn().mockResolvedValue(undefined),
}));

import { mkdir, appendFile } from "node:fs/promises";
import { logHttpTestRequest } from "../file-logger";

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("logHttpTestRequest", () => {
  it("should create the logs directory and append a JSON line", async () => {
    const entry = { method: "POST", status: 200, ip: "1.2.3.4" };

    await logHttpTestRequest(entry);

    expect(mkdir).toHaveBeenCalledWith(expect.stringContaining("logs"), {
      recursive: true,
    });
    expect(appendFile).toHaveBeenCalledWith(
      expect.stringMatching(/\d{4}-\d{2}-\d{2}\.jsonl$/),
      JSON.stringify(entry) + "\n",
      "utf-8",
    );
  });

  it("should handle fs errors gracefully without throwing", async () => {
    vi.mocked(mkdir).mockRejectedValueOnce(new Error("EACCES"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      logHttpTestRequest({ test: true }),
    ).resolves.toBeUndefined();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed to write log file"),
      expect.any(Error),
    );
  });
});
