import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterCta } from "../newsletter-cta";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Bell: () => <span data-testid="bell-icon" />,
  CheckCircle: () => <span data-testid="check-icon" />,
  Loader2: () => <span data-testid="loader-icon" />,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("NewsletterCta", () => {
  function getFormScope() {
    const form = document.querySelector("form")!;
    return within(form);
  }

  it("should render a form with email input and platform buttons", () => {
    render(<NewsletterCta />);
    const scope = getFormScope();

    expect(scope.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(scope.getByText("Capacitor")).toBeInTheDocument();
    expect(scope.getByText("React Native")).toBeInTheDocument();
    expect(scope.getByText("Flutter")).toBeInTheDocument();
    expect(scope.getByText("Kotlin Multiplatform")).toBeInTheDocument();
  });

  it("should submit POST to /api/newsletter/subscribe with email and platforms", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<NewsletterCta />);
    const scope = getFormScope();

    await user.type(scope.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.click(scope.getByText("Capacitor"));
    await user.click(scope.getByRole("checkbox"));
    await user.click(scope.getByText("Notify Me"));

    expect(mockFetch).toHaveBeenCalledWith("/api/newsletter/subscribe", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }));

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.email).toBe("test@example.com");
    expect(body.platforms).toContain("capacitor");
  });

  it("should display success message after successful submit", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    }));

    render(<NewsletterCta />);
    const scope = getFormScope();

    await user.type(scope.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.click(scope.getByRole("checkbox"));
    await user.click(scope.getByText("Notify Me"));

    const msgs = await screen.findAllByText("Check your email to confirm your subscription.");
    expect(msgs[0]).toBeInTheDocument();
  });

  it("should display error message after failed submit", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Email already subscribed" }),
    }));

    render(<NewsletterCta />);
    const scope = getFormScope();

    await user.type(scope.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.click(scope.getByRole("checkbox"));
    await user.click(scope.getByText("Notify Me"));

    const msgs = await screen.findAllByText("Email already subscribed");
    expect(msgs[0]).toBeInTheDocument();
  });

  it("should not submit when consent checkbox is unchecked", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    render(<NewsletterCta />);
    const scope = getFormScope();

    await user.type(scope.getByPlaceholderText("you@example.com"), "test@example.com");
    // Don't check consent — button should not trigger submit
    const submitBtn = scope.getByText("Notify Me").closest("button")!;
    await user.click(submitBtn);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
