"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFramework } from "@/components/framework/framework-provider";
import { DOC_GROUPS, DOC_PAGES } from "@/lib/docs-navigation";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();
  const { frameworkHref } = useFramework();

  return (
    <nav aria-label="Documentation" className="space-y-6">
      <Link
        href={frameworkHref("/docs")}
        className={cn(
          "block text-sm font-semibold transition-colors",
          pathname === "/docs"
            ? "text-primary"
            : "text-foreground hover:text-primary",
        )}
      >
        Docs Home
      </Link>

      {DOC_GROUPS.map((group) => {
        const pages = DOC_PAGES.filter((page) => page.group === group.key);
        if (pages.length === 0) return null;

        return (
          <div key={group.key}>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {group.label}
            </p>
            <ul className="mt-2 space-y-1">
              {pages.map((page) => {
                const href = `/docs/${page.slug}`;
                const active = pathname === href;

                return (
                  <li key={page.slug}>
                    <Link
                      href={frameworkHref(href)}
                      className={cn(
                        "block rounded-md px-3 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {page.shortTitle}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
