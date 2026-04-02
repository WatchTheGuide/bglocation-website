import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { QuickStartSection } from "@/components/docs/quick-start-section";

export const metadata: Metadata = {
  title: "Quick Start — Documentation",
  description:
    "Install, configure, and get your first background location update in 5 minutes with bglocation for Capacitor or React Native.",
};

export default function QuickStartPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <QuickStartSection />
      <DocsPrevNext />
    </>
  );
}
