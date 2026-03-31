// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { deleteMany } = vi.hoisted(() => ({
  deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    subscriber: { deleteMany },
  },
}));

// lastCleanup is module-level state. We must reset modules between tests.
async function importCleanup() {
  const mod = await import("../cleanup");
  return mod.cleanupStaleSubscribers;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  vi.useFakeTimers({ now: new Date("2025-06-01T12:00:00Z") });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("cleanupStaleSubscribers", () => {
  it("should call prisma.subscriber.deleteMany with correct conditions", async () => {
    const cleanupStaleSubscribers = await importCleanup();
    await cleanupStaleSubscribers();

    expect(deleteMany).toHaveBeenCalledOnce();
    const call = deleteMany.mock.calls[0][0];
    const orConditions = call.where.OR;

    expect(orConditions).toHaveLength(2);
    expect(orConditions[0].status).toBe("pending");
    expect(orConditions[1].status).toBe("unsubscribed");
  });

  it("should throttle — skip if called again within 1 hour", async () => {
    const cleanupStaleSubscribers = await importCleanup();
    await cleanupStaleSubscribers();
    expect(deleteMany).toHaveBeenCalledOnce();

    await cleanupStaleSubscribers();
    expect(deleteMany).toHaveBeenCalledOnce(); // still 1 — not called again
  });

  it("should run again after 1 hour has passed", async () => {
    const cleanupStaleSubscribers = await importCleanup();
    await cleanupStaleSubscribers();
    expect(deleteMany).toHaveBeenCalledOnce();

    vi.advanceTimersByTime(60 * 60 * 1000 + 1);
    await cleanupStaleSubscribers();
    expect(deleteMany).toHaveBeenCalledTimes(2);
  });

  it("should reset throttle on Prisma error so next call retries", async () => {
    const cleanupStaleSubscribers = await importCleanup();
    deleteMany.mockRejectedValueOnce(new Error("DB connection lost"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await cleanupStaleSubscribers();
    expect(consoleSpy).toHaveBeenCalled();

    // The throttle was reset, so an immediate call should try again
    deleteMany.mockResolvedValueOnce({ count: 0 });
    await cleanupStaleSubscribers();
    expect(deleteMany).toHaveBeenCalledTimes(2);
  });
});
