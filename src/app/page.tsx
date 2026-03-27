import { Hero } from "@/components/landing/hero";
import { LaunchCountdown } from "@/components/landing/launch-countdown";
import { TrustBar } from "@/components/landing/trust-bar";
import { Features } from "@/components/landing/features";
import { CodeExample } from "@/components/landing/code-example";
import { Comparison } from "@/components/landing/comparison";
import { NewsletterCta } from "@/components/landing/newsletter-cta";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LaunchCountdown />
      <TrustBar />
      <Features />
      <CodeExample />
      <Comparison />
      <NewsletterCta />
      <CtaSection />
    </>
  );
}
