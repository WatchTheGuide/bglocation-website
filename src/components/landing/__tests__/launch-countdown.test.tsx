import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LaunchCountdown } from "../launch-countdown";

// Mock dependencies
vi.mock("lucide-react", () => ({
  Rocket: () => <span data-testid="rocket-icon" />,
}));

vi.mock("@/components/framework/framework-provider", () => ({
  useFramework: () => ({
    framework: "capacitor",
    frameworkHref: (href: string) => href,
  }),
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("LaunchCountdown", () => {
  it("should render 4 time blocks when launch is in the future", () => {
    // Set time well before launch (April 27, 2026)
    vi.useFakeTimers({ now: new Date("2025-06-01T12:00:00Z") });

    render(<LaunchCountdown />);

    expect(screen.getByText("days")).toBeInTheDocument();
    expect(screen.getByText("hours")).toBeInTheDocument();
    expect(screen.getByText("min")).toBeInTheDocument();
    expect(screen.getByText("sec")).toBeInTheDocument();
  });

  it('should show "Now Available" when past launch date', () => {
    vi.useFakeTimers({ now: new Date("2026-05-01T12:00:00Z") });

    render(<LaunchCountdown />);

    expect(screen.getByText("Now Available")).toBeInTheDocument();
    expect(screen.getByText("License Sales Are Open!")).toBeInTheDocument();
  });
});
