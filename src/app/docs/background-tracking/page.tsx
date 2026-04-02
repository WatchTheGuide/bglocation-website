import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { BackgroundTrackingSection } from "@/components/docs/background-tracking-section";

export const metadata: Metadata = {
  title: "Background Location Tracking — Documentation",
  description:
    "Configure distance filter, heartbeat interval, accuracy, and understand battery impact for background GPS tracking with bglocation.",
};

export default function BackgroundTrackingPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <BackgroundTrackingSection />
      <DocsPrevNext />
    </>
  );
}
