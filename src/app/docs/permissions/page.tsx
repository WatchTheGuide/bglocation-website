import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { PermissionsSection } from "@/components/docs/permissions-section";

export const metadata: Metadata = {
  title: "Permissions & Setup — Documentation",
  description:
    "iOS and Android location permissions, background modes, Expo config plugin, and App Store/Play Store guidelines for bglocation.",
};

export default function PermissionsPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <PermissionsSection />
      <DocsPrevNext />
    </>
  );
}
