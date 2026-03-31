import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FrameworkSwitcher } from "../framework-switcher";

vi.mock("lucide-react", () => ({
  Check: () => <span data-testid="check-icon" />,
  ChevronDown: () => <span data-testid="chevron-icon" />,
  Clock3: () => <span data-testid="clock-icon" />,
}));

vi.mock("@/components/framework/framework-provider", () => ({
  useFramework: () => ({
    framework: "capacitor",
    frameworkHref: (path: string) => `${path}?framework=capacitor`,
    frameworkOptionHref: (fw: string) => `/?framework=${fw}`,
  }),
}));

// shouldUseFrameworkMenuMode returns false (segmented mode) by default in tests
// since window.matchMedia is not available

describe("FrameworkSwitcher", () => {
  it("should render framework options as links", () => {
    render(<FrameworkSwitcher />);

    const switcher = screen.getByTestId("framework-switcher");
    expect(switcher).toBeInTheDocument();

    // Check that framework option links exist
    const capacitorLink = screen.getByLabelText("Switch to Capacitor");
    expect(capacitorLink).toBeInTheDocument();
    expect(capacitorLink).toHaveAttribute("aria-current", "page");

    const rnLink = screen.getByLabelText("Switch to React Native");
    expect(rnLink).toBeInTheDocument();
  });
});
