import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Features } from "../features";

vi.mock("lucide-react", () => {
  const icon = () => <span data-testid="icon" />;
  return {
    MapPin: icon,
    Wifi: icon,
    WifiOff: icon,
    Timer: icon,
    Shield: icon,
    Activity: icon,
    Radio: icon,
    Bug: icon,
    BatteryWarning: icon,
  };
});

describe("Features", () => {
  it("should render the section heading and feature cards", () => {
    render(<Features />);

    expect(
      screen.getByText("Everything You Need for Location Tracking"),
    ).toBeInTheDocument();
    expect(screen.getByText("Background GPS Tracking")).toBeInTheDocument();
    expect(screen.getByText("Native HTTP Posting")).toBeInTheDocument();
    expect(screen.getByText("Offline Buffer")).toBeInTheDocument();
    expect(screen.getByText("Heartbeat Timer")).toBeInTheDocument();
  });
});
