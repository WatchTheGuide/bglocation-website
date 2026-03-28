import type { Metadata } from "next";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for bglocation. One perpetual license model for Capacitor and React Native, with 1 year of updates included. From $149.",
};

export default function PricingPage() {
  return (
    <>
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Install and evaluate with trial mode — 30 min sessions, all features included across Capacitor and React Native wrappers.{" "}
            <strong>No license key needed</strong> to start.
            Buy a license when you&apos;re ready for production.
          </p>
        </div>
      </section>

      <PricingCards />
      <PricingFaq />
    </>
  );
}
