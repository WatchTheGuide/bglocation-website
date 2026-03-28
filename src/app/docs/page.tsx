import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { DocsIntro } from "@/components/docs/docs-intro";
import { GettingStarted } from "@/components/docs/getting-started-section";
import { Configuration } from "@/components/docs/configuration-section";
import { ApiReference } from "@/components/docs/api-reference-section";
import { PlatformGuides } from "@/components/docs/platform-guides-section";
import { Licensing } from "@/components/docs/licensing-section";
import { Examples } from "@/components/docs/examples-section";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Guides, API reference, and examples for bglocation — the production-ready background location SDK for Capacitor and React Native apps.",
};

export default function DocsPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <DocsIntro />

        {/* Documentation Sections */}
        <div className="mt-24 space-y-16">
          <GettingStarted />
          <Separator />
          <Configuration />
          <Separator />
          <ApiReference />
          <Separator />
          <PlatformGuides />
          <Separator />
          <Licensing />
          <Separator />
          <Examples />
        </div>
      </div>
    </section>
  );
}
