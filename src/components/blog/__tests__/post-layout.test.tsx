import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostLayout } from "../post-layout";
import type { Post } from "@/lib/posts";

// Mock lucide-react to avoid SVG rendering issues
vi.mock("lucide-react", () => ({
  ArrowLeft: () => <span data-testid="arrow-left-icon" />,
}));

const mockPost: Post = {
  slug: "test-layout",
  title: "Layout Post Title",
  description: "Description for layout post.",
  date: "2025-05-15",
  tags: ["react-native", "location"],
  published: true,
  author: "Jane Doe",
  coverImage: null,
  canonicalUrl: null,
  readingTime: 5,
  content: "Full content here",
};

describe("PostLayout", () => {
  it("should render title, date, author, and reading time", () => {
    render(<PostLayout post={mockPost} />);

    expect(screen.getByText("Layout Post Title")).toBeInTheDocument();
    expect(screen.getByText("May 15, 2025")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("should render tags as Badge elements", () => {
    render(<PostLayout post={mockPost} />);

    expect(screen.getAllByText("react-native").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("location").length).toBeGreaterThanOrEqual(1);
  });

  it('should render "Back to blog" link with href /blog', () => {
    render(<PostLayout post={mockPost} />);

    const links = screen.getAllByRole("link");
    const backLink = links.find(
      (l) => l.getAttribute("href") === "/blog",
    );
    expect(backLink).toBeDefined();
    expect(backLink!.textContent).toContain("Back to blog");
  });

  it("should render children", () => {
    render(
      <PostLayout post={mockPost}>
        <div data-testid="child-content">Child content here</div>
      </PostLayout>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });
});
