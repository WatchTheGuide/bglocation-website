import { getAllPosts } from "@/lib/posts";

const BASE_URL = "https://bglocation.dev";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCdata(str: string): string {
  return str.replace(/]]>/g, "]]]]><![CDATA[>");
}

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `    <item>
      <title><![CDATA[${escapeCdata(post.title)}]]></title>
      <link>${BASE_URL}/blog/${escapeXml(post.slug)}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${escapeXml(post.slug)}</guid>
      <description><![CDATA[${escapeCdata(post.description)}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>hello@bglocation.dev (${escapeXml(post.author)})</author>
${post.tags.map((tag) => `      <category><![CDATA[${escapeCdata(tag)}]]></category>`).join("\n")}
    </item>`
    )
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>bglocation Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>News, tutorials, and insights about background location tracking for Capacitor and React Native.</description>
    <language>en-us</language>
    <lastBuildDate>${posts.length > 0 ? new Date(Math.max(...posts.map((p) => new Date(p.date).getTime()))).toUTCString() : new Date(0).toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
