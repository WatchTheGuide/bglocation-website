import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostCard } from "../post-card";
import type { Post } from "@/lib/posts";

const mockPost: Post = {
  slug: "test-post",
  title: "Test Post Title",
  description: "A short description of the test post for testing purposes.",
  date: "2025-06-01",
  tags: ["capacitor", "gps"],
  published: true,
  author: "Test Author",
  coverImage: null,
  canonicalUrl: null,
  readingTime: 3,
  content: "Some content",
};

describe("PostCard", () => {
  it("should render title, description, date, and reading time", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
    expect(
      screen.getByText(
        "A short description of the test post for testing purposes.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("3 min read")).toBeInTheDocument();
    expect(screen.getByText("June 1, 2025")).toBeInTheDocument();
  });

  it("should render tags as Badge elements", () => {
    render(<PostCard post={mockPost} />);

    const badges = screen.getAllByText("capacitor");
    expect(badges.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("gps").length).toBeGreaterThanOrEqual(1);
  });

  it("should link to /blog/[slug]", () => {
    render(<PostCard post={mockPost} />);

    const links = screen.getAllByRole("link");
    const blogLink = links.find(
      (l) => l.getAttribute("href") === "/blog/test-post",
    );
    expect(blogLink).toBeDefined();
  });

  it("should apply line-clamp-3 class to description", () => {
    const { container } = render(<PostCard post={mockPost} />);

    const desc = container.querySelector(".line-clamp-3");
    expect(desc).not.toBeNull();
    expect(desc!.textContent).toBe(
      "A short description of the test post for testing purposes.",
    );
  });
});
