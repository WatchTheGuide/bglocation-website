import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingFaq } from "../pricing-faq";

vi.mock("lucide-react", () => ({
  ChevronDownIcon: () => <span data-testid="chevron-down" />,
  ChevronUpIcon: () => <span data-testid="chevron-up" />,
}));

describe("PricingFaq", () => {
  it("should render FAQ questions", () => {
    render(<PricingFaq />);

    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(screen.getByText("How does trial mode work?")).toBeInTheDocument();
    expect(screen.getByText("What is a bundle ID and how are licenses bound?")).toBeInTheDocument();
    expect(screen.getByText("Is there a refund policy?")).toBeInTheDocument();
  });
});
