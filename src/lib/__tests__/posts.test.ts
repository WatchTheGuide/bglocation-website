// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("node:fs");

import fs from "node:fs";
import { getAllPosts, getPostBySlug } from "../posts";

const FRONTMATTER_A = `---
title: Post A
slug: post-a
description: Description A
date: "2025-02-01"
tags: [capacitor]
published: true
author: Author A
---
Content of post A with enough words to test.`;

const FRONTMATTER_B = `---
title: Post B
slug: post-b
description: Description B
date: "2025-03-01"
tags: [react-native, gps]
published: true
author: Author B
cover_image: /images/b.png
canonical_url: https://example.com/b
---
Content of post B.`;

const FRONTMATTER_DRAFT = `---
title: Draft Post
slug: draft
description: Draft
date: "2025-01-01"
tags: []
published: false
author: Draft Author
---
Draft content.`;

beforeEach(() => {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  (vi.mocked(fs.readdirSync) as ReturnType<typeof vi.fn>).mockReturnValue([
    "post-a.md",
    "post-b.md",
    "draft.md",
    "not-md.txt",
  ]);
  vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
    const p = String(filePath);
    if (p.endsWith("post-a.md")) return FRONTMATTER_A;
    if (p.endsWith("post-b.md")) return FRONTMATTER_B;
    if (p.endsWith("draft.md")) return FRONTMATTER_DRAFT;
    throw new Error(`Unexpected file: ${p}`);
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("getAllPosts", () => {
  it("should return only published posts", () => {
    const posts = getAllPosts();
    expect(posts).toHaveLength(2);
    expect(posts.every((p) => p.published)).toBe(true);
  });

  it("should sort posts by date descending (newest first)", () => {
    const posts = getAllPosts();
    expect(posts[0].slug).toBe("post-b");
    expect(posts[1].slug).toBe("post-a");
  });

  it("should parse frontmatter fields correctly", () => {
    const posts = getAllPosts();
    const postB = posts[0];
    expect(postB.title).toBe("Post B");
    expect(postB.description).toBe("Description B");
    expect(postB.tags).toEqual(["react-native", "gps"]);
    expect(postB.coverImage).toBe("/images/b.png");
    expect(postB.canonicalUrl).toBe("https://example.com/b");
  });

  it("should default coverImage and canonicalUrl to null", () => {
    const posts = getAllPosts();
    const postA = posts.find((p) => p.slug === "post-a")!;
    expect(postA.coverImage).toBeNull();
    expect(postA.canonicalUrl).toBeNull();
  });

  it("should calculate reading time >= 1", () => {
    const posts = getAllPosts();
    posts.forEach((p) => {
      expect(p.readingTime).toBeGreaterThanOrEqual(1);
    });
  });

  it("should return empty array when posts directory does not exist", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getAllPosts()).toEqual([]);
  });

  it("should ignore non-.md files", () => {
    const posts = getAllPosts();
    expect(posts.find((p) => p.slug === "not-md")).toBeUndefined();
  });
});

describe("getPostBySlug", () => {
  it("should return the matching post", () => {
    const post = getPostBySlug("post-a");
    expect(post).not.toBeNull();
    expect(post!.title).toBe("Post A");
  });

  it("should return null for unknown slug", () => {
    expect(getPostBySlug("does-not-exist")).toBeNull();
  });

  it("should return null for a draft slug", () => {
    expect(getPostBySlug("draft")).toBeNull();
  });
});
