import type { Metadata } from "next";
import { DocsHub } from "@/components/docs/docs-hub";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Guides, API reference, and examples for bglocation — the production-ready background location SDK for Capacitor and React Native apps.",
  alternates: { canonical: "/docs" },
};

export default function DocsPage() {
  return <DocsHub />;
}
