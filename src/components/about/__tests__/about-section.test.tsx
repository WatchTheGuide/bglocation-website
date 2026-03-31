import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutSection } from "../about-section";

vi.mock("lucide-react", () => ({
  Award: () => <span data-testid="award-icon" />,
  BookOpen: () => <span data-testid="book-icon" />,
  Code2: () => <span data-testid="code-icon" />,
  Linkedin: () => <span data-testid="linkedin-icon" />,
  Mail: () => <span data-testid="mail-icon" />,
  MapPin: () => <span data-testid="map-icon" />,
}));

describe("AboutSection", () => {
  it("should render author bio and contact links", () => {
    render(<AboutSection />);

    expect(screen.getByText("Szymon Walczak")).toBeInTheDocument();
    expect(screen.getByText(/hello@bglocation\.dev/)).toBeInTheDocument();
    expect(screen.getByText(/linkedin\.com\/in\/szymonwalczak/)).toBeInTheDocument();
  });
});
