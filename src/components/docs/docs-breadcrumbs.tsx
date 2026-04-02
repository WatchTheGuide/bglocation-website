"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFramework } from "@/components/framework/framework-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getDocPage } from "@/lib/docs-navigation";

export function DocsBreadcrumbs() {
  const pathname = usePathname();
  const { frameworkHref } = useFramework();

  const slug = pathname.replace("/docs/", "").replace("/docs", "");
  const page = slug ? getDocPage(slug) : undefined;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={frameworkHref("/docs")} />}>
            Docs
          </BreadcrumbLink>
        </BreadcrumbItem>
        {page && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{page.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
