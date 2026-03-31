import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FrameworkProvider, useFramework } from "../framework-provider";

vi.mock("lucide-react", () => ({}));

afterEach(() => {
  vi.restoreAllMocks();
});

function Consumer() {
  const { framework, frameworkHref } = useFramework();
  return (
    <div>
      <span data-testid="framework">{framework}</span>
      <span data-testid="href">{frameworkHref("/docs")}</span>
    </div>
  );
}

describe("FrameworkProvider", () => {
  it("should provide default framework as capacitor", () => {
    render(
      <FrameworkProvider>
        <Consumer />
      </FrameworkProvider>,
    );

    expect(screen.getByTestId("framework")).toHaveTextContent("capacitor");
  });

  it("should build frameworkHref with framework query param", () => {
    render(
      <FrameworkProvider>
        <Consumer />
      </FrameworkProvider>,
    );

    const hrefs = screen.getAllByTestId("href");
    expect(hrefs[0]).toHaveTextContent("/docs?framework=capacitor");
  });

  it("should throw if useFramework is used outside provider", () => {
    // Suppress React console.error for expected error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      "useFramework must be used within FrameworkProvider",
    );

    spy.mockRestore();
  });
});
