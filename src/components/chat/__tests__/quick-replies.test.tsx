import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuickReplies } from "../quick-replies";

describe("QuickReplies", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render 4 suggestion buttons", () => {
    const { container } = render(<QuickReplies onSelect={vi.fn()} />);
    const scope = within(container);

    expect(scope.getByText("What features does the plugin include?")).toBeInTheDocument();
    expect(scope.getByText("How does pricing work?")).toBeInTheDocument();
    expect(scope.getByText("How do I set up background tracking?")).toBeInTheDocument();
    expect(scope.getByText("Does the trial mode have limitations?")).toBeInTheDocument();
  });

  it("should call onSelect callback with question text on click", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = render(<QuickReplies onSelect={onSelect} />);
    const scope = within(container);

    await user.click(scope.getByText("How does pricing work?"));

    expect(onSelect).toHaveBeenCalledWith("How does pricing work?");
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
