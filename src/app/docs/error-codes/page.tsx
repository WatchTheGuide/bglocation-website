import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { ErrorCodesSection } from "@/components/docs/error-codes-section";

export const metadata: Metadata = {
  title: "Error Codes — @bglocation Documentation",
  description:
    "Complete reference of error codes returned by the plugin with descriptions and fixes.",
  alternates: { canonical: "/docs/error-codes" },
};

export default function ErrorCodesPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <ErrorCodesSection />
      <DocsPrevNext />
    </>
  );
}
