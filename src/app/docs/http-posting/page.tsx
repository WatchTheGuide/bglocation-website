import type { Metadata } from "next";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { HttpPostingSection } from "@/components/docs/http-posting-section";

export const metadata: Metadata = {
  title: "HTTP Posting & Offline Buffer — Documentation",
  description:
    "Configure native HTTP POST for location data with automatic offline buffering and retry in bglocation.",
};

export default function HttpPostingPage() {
  return (
    <>
      <DocsBreadcrumbs />
      <HttpPostingSection />
      <DocsPrevNext />
    </>
  );
}
