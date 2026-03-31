import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group rounded-xl border bg-card p-6 transition-colors hover:bg-accent/50">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>&middot;</span>
          <span>{post.readingTime} min read</span>
        </div>

        <h2 className="mb-2 text-xl font-semibold tracking-tight group-hover:text-primary">
          {post.title}
        </h2>

        <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </Link>
    </article>
  );
}
