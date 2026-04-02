import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { MigrationSection } from "@/components/docs/migration-section";

export const metadata: Metadata = {
  title: "Migration Guide — @bglocation Documentation",
  description:
    "Step-by-step migration from capacitor-community/background-geolocation to @bglocation/capacitor.",
};

export default function MigrationPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <MigrationSection />
      <DocsPrevNext />
    </>
  );
}
