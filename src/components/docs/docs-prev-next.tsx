"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFramework } from "@/components/framework/framework-provider";
import { getAdjacentPages } from "@/lib/docs-navigation";

export function DocsPrevNext() {
  const pathname = usePathname();
  const { frameworkHref } = useFramework();

  const slug = pathname.replace("/docs/", "").replace("/docs", "");
  if (!slug) return null;

  const { prev, next } = getAdjacentPages(slug);

  if (!prev && !next) return null;

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-stretch gap-4 border-t pt-8">
      {prev ? (
        <Link
          href={frameworkHref(`/docs/${prev.slug}`)}
          className="group flex flex-1 flex-col items-start rounded-lg border p-4 transition-colors hover:border-primary/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronLeft className="size-3" />
            Previous
          </span>
          <span className="mt-1 text-sm font-medium group-hover:text-primary">
            {prev.shortTitle}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={frameworkHref(`/docs/${next.slug}`)}
          className="group flex flex-1 flex-col items-end rounded-lg border p-4 transition-colors hover:border-primary/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Next
            <ChevronRight className="size-3" />
          </span>
          <span className="mt-1 text-sm font-medium group-hover:text-primary">
            {next.shortTitle}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
