"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useFramework } from "@/components/framework/framework-provider";
import { getDocPage } from "@/lib/docs-navigation";

export function DocsBreadcrumbs() {
  const pathname = usePathname();
  const { frameworkHref } = useFramework();

  const slug = pathname.replace("/docs/", "").replace("/docs", "");
  const page = slug ? getDocPage(slug) : undefined;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href={frameworkHref("/docs")} className="transition-colors hover:text-foreground">
        Docs
      </Link>
      {page && (
        <>
          <ChevronRight className="size-3.5" />
          <span className="font-medium text-foreground">{page.title}</span>
        </>
      )}
    </nav>
  );
}
