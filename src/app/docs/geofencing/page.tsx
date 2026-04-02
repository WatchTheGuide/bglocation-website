import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { GeofencingSection } from "@/components/docs/geofencing-section";

export const metadata: Metadata = {
  title: "Geofencing Guide — Documentation",
  description:
    "Monitor circular regions, react to enter/exit/dwell transitions, and manage up to 20 geofences with bglocation.",
};

export default function GeofencingPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <GeofencingSection />
      <DocsPrevNext />
    </>
  );
}
