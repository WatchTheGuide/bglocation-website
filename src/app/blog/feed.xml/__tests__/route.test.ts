// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/posts", () => ({
  getAllPosts: vi.fn(),
}));

import { GET } from "../route";
import { getAllPosts } from "@/lib/posts";

const mockGetAllPosts = getAllPosts as ReturnType<typeof vi.fn>;

describe("GET /blog/feed.xml", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return valid RSS XML with correct content-type", async () => {
    mockGetAllPosts.mockReturnValue([
      {
        slug: "test-post",
        title: "Test Post",
        description: "A test post",
        date: "2025-01-15",
        author: "Test Author",
        tags: ["capacitor", "gps"],
      },
    ]);

    const response = await GET();

    expect(response.headers.get("Content-Type")).toBe(
      "application/rss+xml; charset=utf-8"
    );
    const body = await response.text();
    expect(body).toContain('<?xml version="1.0"');
    expect(body).toContain("<rss version=\"2.0\"");
    expect(body).toContain("<title><![CDATA[Test Post]]></title>");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bglocation.dev";
    expect(body).toContain(`<link>${baseUrl}/blog/test-post</link>`);
    expect(body).toContain("<category><![CDATA[capacitor]]></category>");
    expect(body).toContain("<category><![CDATA[gps]]></category>");
    expect(body).toContain(
      "<author>hello@bglocation.dev (Test Author)</author>"
    );
  });

  it("should return empty channel when no posts", async () => {
    mockGetAllPosts.mockReturnValue([]);

    const response = await GET();
    const body = await response.text();

    expect(body).toContain("<channel>");
    expect(body).not.toContain("<item>");
  });

  it("should include multiple posts as separate items", async () => {
    mockGetAllPosts.mockReturnValue([
      {
        slug: "post-1",
        title: "First",
        description: "Desc 1",
        date: "2025-01-10",
        author: "Author",
        tags: [],
      },
      {
        slug: "post-2",
        title: "Second",
        description: "Desc 2",
        date: "2025-01-15",
        author: "Author",
        tags: [],
      },
    ]);

    const response = await GET();
    const body = await response.text();

    expect(body).toContain("<title><![CDATA[First]]></title>");
    expect(body).toContain("<title><![CDATA[Second]]></title>");
    expect((body.match(/<item>/g) ?? []).length).toBe(2);
  });
});
