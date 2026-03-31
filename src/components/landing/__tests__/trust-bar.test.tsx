import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrustBar } from "../trust-bar";

vi.mock("lucide-react", () => {
  const icon = () => <span data-testid="icon" />;
  return {
    FlaskConical: icon,
    Smartphone: icon,
    TestTubes: icon,
    Code: icon,
    Eye: icon,
  };
});

describe("TrustBar", () => {
  it("should render statistics", () => {
    render(<TrustBar />);

    expect(screen.getByText("300+")).toBeInTheDocument();
    expect(screen.getByText("Unit Tests")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Native Platforms")).toBeInTheDocument();
    expect(screen.getByText("3,200+")).toBeInTheDocument();
  });
});
