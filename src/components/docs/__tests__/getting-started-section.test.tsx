import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GettingStarted } from "../getting-started-section";

vi.mock("@/components/framework/framework-provider", () => ({
  useFramework: () => ({
    framework: "capacitor",
    frameworkHref: (path: string) => path,
    frameworkOptionHref: (fw: string) => `/?framework=${fw}`,
  }),
}));

describe("GettingStarted", () => {
  it("should render install and usage code snippets", () => {
    render(<GettingStarted />);

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    // Contains install command
    expect(screen.getByText(/npm install @bglocation\/capacitor/)).toBeInTheDocument();
  });
});
