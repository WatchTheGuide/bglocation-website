import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");
const WORDS_PER_MINUTE = 200;

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  author: string;
  coverImage: string | null;
  canonicalUrl: string | null;
  readingTime: number;
  content: string;
};

type Frontmatter = {
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  author: string;
  cover_image?: string;
  canonical_url?: string;
};

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function parsePost(filename: string): Post | null {
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  if (!fm.published) return null;

  return {
    slug: fm.slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    tags: fm.tags ?? [],
    published: fm.published,
    author: fm.author,
    coverImage: fm.cover_image ?? null,
    canonicalUrl: fm.canonical_url ?? null,
    readingTime: calculateReadingTime(content),
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parsePost)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(POSTS_DIR)) return null;

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const post = parsePost(file);
    if (post?.slug === slug) return post;
  }
  return null;
}
