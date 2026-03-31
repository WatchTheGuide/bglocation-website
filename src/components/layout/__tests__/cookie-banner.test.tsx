import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const STORAGE_KEY = "bgl_cookie_consent_v1";

vi.mock("@/components/framework/framework-provider", () => ({
  useFramework: () => ({
    framework: "capacitor",
    setFramework: vi.fn(),
    frameworkHref: (path: string) => path,
  }),
}));

vi.mock("lucide-react", () => ({}));

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.resetModules();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("CookieBanner", () => {
  it("should be visible when no consent in localStorage", async () => {
    const { CookieBanner } = await import("../cookie-banner");
    render(<CookieBanner />);

    expect(screen.getByRole("region", { name: /cookie notice/i })).toBeInTheDocument();
    expect(screen.getByText(/essential cookies/i)).toBeInTheDocument();
  });

  it("should be hidden when consent is set in localStorage", async () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    const { CookieBanner } = await import("../cookie-banner");
    render(<CookieBanner />);

    expect(screen.queryByRole("region", { name: /cookie notice/i })).not.toBeInTheDocument();
  });

  it("should save consent and hide banner when clicking Got it", async () => {
    const user = userEvent.setup();
    const { CookieBanner } = await import("../cookie-banner");
    render(<CookieBanner />);

    expect(screen.getByRole("region", { name: /cookie notice/i })).toBeInTheDocument();

    await user.click(screen.getByText("Got it"));

    expect(screen.queryByRole("region", { name: /cookie notice/i })).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });
});
