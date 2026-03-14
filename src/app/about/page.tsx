import type { Metadata } from "next";
import { AboutSection } from "@/components/about/about-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Szymon Walczak — the creator of capacitor-bglocation. Senior Software Architect with 20+ years of experience in web and mobile development.",
};

export default function AboutPage() {
  return (
    <>
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            The person behind capacitor-bglocation.
          </p>
        </div>
      </section>

      <AboutSection />
    </>
  );
}
