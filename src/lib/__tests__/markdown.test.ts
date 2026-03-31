// @vitest-environment node
import { describe, it, expect } from "vitest";
import { renderMarkdown } from "../markdown";

describe("renderMarkdown", () => {
  it("should render headings", async () => {
    const html = await renderMarkdown("# Hello");
    expect(html).toContain("<h1>Hello</h1>");
  });

  it("should render paragraphs", async () => {
    const html = await renderMarkdown("Some text here.");
    expect(html).toContain("<p>Some text here.</p>");
  });

  it("should render bold and italic", async () => {
    const html = await renderMarkdown("**bold** and *italic*");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>italic</em>");
  });

  it("should render links", async () => {
    const html = await renderMarkdown("[Click](https://example.com)");
    expect(html).toContain('<a href="https://example.com">Click</a>');
  });

  it("should render inline code", async () => {
    const html = await renderMarkdown("Use `npm install` to install.");
    expect(html).toContain("<code>npm install</code>");
  });

  it("should render fenced code blocks", async () => {
    const md = "```js\nconsole.log('hi');\n```";
    const html = await renderMarkdown(md);
    expect(html).toContain("<code");
    expect(html).toContain("console");
    expect(html).toContain("log");
  });

  it("should render GFM tables", async () => {
    const md = "| A | B |\n|---|---|\n| 1 | 2 |";
    const html = await renderMarkdown(md);
    expect(html).toContain("<table>");
    expect(html).toContain("<td>1</td>");
  });

  it("should render unordered lists", async () => {
    const html = await renderMarkdown("- one\n- two");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>one</li>");
  });

  it("should render ordered lists", async () => {
    const html = await renderMarkdown("1. first\n2. second");
    expect(html).toContain("<ol>");
    expect(html).toContain("<li>first</li>");
  });

  it("should handle empty string", async () => {
    const html = await renderMarkdown("");
    expect(html).toBe("");
  });
});
