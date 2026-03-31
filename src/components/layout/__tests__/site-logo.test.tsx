import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteLogo } from "../site-logo";

describe("SiteLogo", () => {
  it("should render icon and wordmark", () => {
    const { container } = render(<SiteLogo />);

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/bglocation-icon.svg");

    expect(screen.getByText("bglocation")).toBeInTheDocument();
  });

  it("should render custom wordmark", () => {
    render(<SiteLogo wordmark="Custom Brand" />);

    expect(screen.getByText("Custom Brand")).toBeInTheDocument();
  });
});
