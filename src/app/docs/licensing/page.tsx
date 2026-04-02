import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { LicensingSection } from "@/components/docs/licensing-page-section";

export const metadata: Metadata = {
  title: "Licensing — @bglocation Documentation",
  description:
    "Trial mode, license key placement, offline RSA validation, perpetual model, and update gating.",
};

export default function LicensingPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <LicensingSection />
      <DocsPrevNext />
    </>
  );
}
