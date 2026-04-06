import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { PlatformDifferencesSection } from "@/components/docs/platform-differences-section";

export const metadata: Metadata = {
  title: "Platform Differences — @bglocation Documentation",
  description:
    "Feature availability and behavioral differences across iOS, Android, and Web platforms.",
  alternates: { canonical: "/docs/platform-differences" },
};

export default function PlatformDifferencesPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <PlatformDifferencesSection />
      <DocsPrevNext />
    </>
  );
}
