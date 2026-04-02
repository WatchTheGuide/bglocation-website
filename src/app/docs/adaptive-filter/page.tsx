import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { AdaptiveFilterSection } from "@/components/docs/adaptive-filter-section";

export const metadata: Metadata = {
  title: "Adaptive Distance Filter — Documentation",
  description:
    "Speed-adaptive distance filter for optimal battery use and accuracy. Configure auto mode for walking, cycling, and driving.",
};

export default function AdaptiveFilterPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <AdaptiveFilterSection />
      <DocsPrevNext />
    </>
  );
}
