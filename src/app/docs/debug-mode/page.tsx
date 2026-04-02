import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { DebugModeSection } from "@/components/docs/debug-mode-section";

export const metadata: Metadata = {
  title: "Debug Mode — Documentation",
  description:
    "Enable verbose logs, system sounds, and onDebug events for development and testing with bglocation.",
};

export default function DebugModePage() {
  return (
    <>
      <DocsBreadcrumbs />
      <DebugModeSection />
      <DocsPrevNext />
    </>
  );
}
