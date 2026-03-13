import { Hero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { Features } from "@/components/landing/features";
import { CodeExample } from "@/components/landing/code-example";
import { Comparison } from "@/components/landing/comparison";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Features />
      <CodeExample />
      <Comparison />
      <CtaSection />
    </>
  );
}
