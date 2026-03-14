import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="border-t bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to Ship Background Location?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
          Install and evaluate with trial mode — 30 min sessions, all
          features included. No license key needed to start.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            render={<Link href="/pricing" />}
            nativeButton={false}
            size="lg"
            variant="secondary"
          >
            View Pricing
          </Button>
          <Button
            render={<Link href="/docs" />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            Read the Docs
          </Button>
        </div>
      </div>
    </section>
  );
}
