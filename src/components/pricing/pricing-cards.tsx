import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PLANS = [
  {
    name: "Indie",
    price: 99,
    earlyBirdPrice: 79,
    period: "/year",
    description: "For solo developers and small side projects.",
    bundleIds: "1 bundle ID",
    features: [
      "All plugin features",
      "iOS + Android",
      "npm registry access",
      "Source code access (ELv2)",
      "Email support",
      "Trial mode included",
    ],
    cta: "Buy License",
    highlighted: false,
  },
  {
    name: "Team",
    price: 199,
    earlyBirdPrice: 149,
    period: "/year",
    description: "For teams shipping multiple apps.",
    bundleIds: "5 bundle IDs",
    features: [
      "Everything in Indie",
      "5 production bundle IDs",
      "Priority email support",
      "Early access to new features",
      "Team license management",
      "Trial mode included",
    ],
    cta: "Buy License",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: null,
    earlyBirdPrice: null,
    period: "",
    description: "For organizations with custom requirements.",
    bundleIds: "Unlimited bundle IDs",
    features: [
      "Everything in Team",
      "Unlimited bundle IDs",
      "Dedicated support channel",
      "SLA agreement",
      "Custom integration help",
      "Invoice billing",
    ],
    cta: "Contact Us",
    highlighted: false,
  },
] as const;

export function PricingCards() {
  return (
    <section className="pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Early Adopter Banner */}
        <div className="mb-12 rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
          <Badge variant="secondary" className="mb-2">
            Early Adopter Offer
          </Badge>
          <p className="text-sm text-muted-foreground">
            Launch pricing available for a limited time.
            Lock in <strong>$79/year</strong> (Indie) or{" "}
            <strong>$149/year</strong> (Team) — valid for the first 3 months
            after launch.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlighted
                  ? "relative flex flex-col overflow-visible border-primary shadow-lg"
                  : "relative flex flex-col"
              }
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <Badge>Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>

                <div className="mt-4">
                  {plan.price !== null ? (
                    <>
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold">Custom</span>
                  )}
                </div>

                <p className="mt-1 h-5 text-sm text-primary">
                  {plan.earlyBirdPrice
                    ? `$${plan.earlyBirdPrice}/yr early adopter price`
                    : "\u00A0"}
                </p>

                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {plan.bundleIds}
                </p>
              </CardHeader>

              <Separator />

              <CardContent className="flex-1 pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {plan.price !== null ? (
                  <Button
                    render={<Link href="#" />}
                    nativeButton={false}
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                ) : (
                  <Button
                    render={<a href="mailto:hello@bglocation.dev" />}
                    nativeButton={false}
                    className="w-full"
                    variant="outline"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* License Note */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No license key needed to evaluate — trial mode gives you 30 min
          of tracking per session. Licenses are bound to your bundle ID,
          validated offline.
        </p>
      </div>
    </section>
  );
}
