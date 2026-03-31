import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ApiReference } from "../api-reference-section";

vi.mock("@/components/framework/framework-provider", () => ({
  useFramework: () => ({
    framework: "capacitor",
    frameworkHref: (path: string) => path,
    frameworkOptionHref: (fw: string) => `/?framework=${fw}`,
  }),
}));

describe("ApiReference", () => {
  it("should render events and methods tables", () => {
    render(<ApiReference />);

    // Check section heading
    expect(screen.getAllByText(/API Reference/i)[0]).toBeInTheDocument();

    // Check key events are listed
    expect(screen.getByText("onLocation")).toBeInTheDocument();
    expect(screen.getByText("onHeartbeat")).toBeInTheDocument();
    expect(screen.getByText("onGeofence")).toBeInTheDocument();
  });
});
