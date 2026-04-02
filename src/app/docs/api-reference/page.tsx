import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { ApiReferenceSection } from "@/components/docs/api-reference-page-section";

export const metadata: Metadata = {
  title: "API Reference — @bglocation Documentation",
  description:
    "Complete TypeScript API: methods, events, interfaces, and error codes.",
};

export default function ApiReferencePage() {
  return (
    <>
      <DocsBreadcrumbs />
      <ApiReferenceSection />
      <DocsPrevNext />
    </>
  );
}
