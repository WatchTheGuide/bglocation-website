import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingCards } from "../pricing-cards";

vi.mock("lucide-react", () => ({
  Check: () => <span data-testid="check-icon" />,
  Clock: () => <span data-testid="clock-icon" />,
  KeyRound: () => <span data-testid="key-icon" />,
  RefreshCw: () => <span data-testid="refresh-icon" />,
  ShieldCheck: () => <span data-testid="shield-icon" />,
}));

vi.mock("@/components/pricing/checkout-dialog", () => ({
  CheckoutDialog: ({ planName, price }: { planName: string; price: string }) => (
    <button>{`Buy ${planName} - ${price}`}</button>
  ),
}));

describe("PricingCards", () => {
  it("should render all 4 plans with prices", () => {
    render(<PricingCards />);

    expect(screen.getAllByText("Indie")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Team")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Factory")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Enterprise")[0]).toBeInTheDocument();

    // Check prices are displayed
    expect(screen.getByText("$199")).toBeInTheDocument();
    expect(screen.getByText("$299")).toBeInTheDocument();
    expect(screen.getByText("$499")).toBeInTheDocument();
    expect(screen.getAllByText("Custom")[0]).toBeInTheDocument();
  });

  it("should show Most Popular badge on Team plan", () => {
    render(<PricingCards />);

    expect(screen.getAllByText("Most Popular")[0]).toBeInTheDocument();
  });
});
