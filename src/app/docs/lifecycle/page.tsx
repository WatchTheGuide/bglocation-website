import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { LifecycleSection } from "@/components/docs/lifecycle-section";

export const metadata: Metadata = {
  title: "Lifecycle & Auto-Resume — Documentation",
  description:
    "How bglocation resumes background tracking after the app is force-quit, OOM-killed, or the device reboots — and when auto-resume is not possible.",
  alternates: { canonical: "/docs/lifecycle" },
};

export default function LifecyclePage() {
  return (
    <>
      <DocsBreadcrumbs />
      <LifecycleSection />
      <DocsPrevNext />
    </>
  );
}
