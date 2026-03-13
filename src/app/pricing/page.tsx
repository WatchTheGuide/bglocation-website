import type { Metadata } from "next";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for capacitor-bglocation. Start with a free trial, upgrade when ready. From $99/year.",
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
            Install for free, evaluate with the trial.{" "}
            <strong>No credit card needed</strong> to start.
            Upgrade when you&apos;re ready for production.
          </p>
        </div>
      </section>

      <PricingCards />
      <PricingFaq />
    </>
  );
}
