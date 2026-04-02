import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { ExamplesSection } from "@/components/docs/examples-page-section";

export const metadata: Metadata = {
  title: "Examples — @bglocation Documentation",
  description:
    "Real-world integration patterns: fleet tracking, fitness apps, geofencing, and attendance systems.",
};

export default function ExamplesPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <ExamplesSection />
      <DocsPrevNext />
    </>
  );
}
