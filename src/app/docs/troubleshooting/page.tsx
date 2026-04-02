import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { TroubleshootingSection } from "@/components/docs/troubleshooting-section";

export const metadata: Metadata = {
  title: "Troubleshooting — @bglocation Documentation",
  description:
    "Common issues and solutions for background location tracking on iOS and Android.",
};

export default function TroubleshootingPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <TroubleshootingSection />
      <DocsPrevNext />
    </>
  );
}
