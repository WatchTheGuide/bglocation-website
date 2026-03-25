import { Check, Clock, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckoutDialog } from "@/components/pricing/checkout-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function checkoutUrl(envUrl: string | undefined): string | null {
  if (!envUrl) return null;
  return envUrl;
}

const INDIE_CHECKOUT_URL = checkoutUrl(
  process.env.NEXT_PUBLIC_LS_CHECKOUT_URL_INDIE,
);
const TEAM_CHECKOUT_URL = checkoutUrl(
  process.env.NEXT_PUBLIC_LS_CHECKOUT_URL_TEAM,
);
const FACTORY_CHECKOUT_URL = checkoutUrl(
  process.env.NEXT_PUBLIC_LS_CHECKOUT_URL_FACTORY,
);

const PLANS = [
  {
    name: "Indie",
    price: 199,
    earlyBirdPrice: 149,
    period: "",
    description: "For solo developers and side projects.",
    bundleIds: "1 bundle ID",
    features: [
      "All plugin features",
      "iOS + Android",
      "Perpetual license",
      "1 year of updates included",
      "Source code access (ELv2)",
      "Email support",
    ],
    cta: "Buy License",
    highlighted: false,
    checkoutUrl: INDIE_CHECKOUT_URL,
  },
  {
    name: "Team",
    price: 299,
    earlyBirdPrice: 229,
    period: "",
    description: "For small teams shipping multiple apps.",
    bundleIds: "5 bundle IDs",
    features: [
      "Everything in Indie",
      "5 production bundle IDs",
      "Priority email support",
      "Early access to new features",
      "Team license management",
    ],
    cta: "Buy License",
    highlighted: true,
    checkoutUrl: TEAM_CHECKOUT_URL,
  },
  {
    name: "Factory",
    price: 499,
    earlyBirdPrice: 399,
    period: "",
    description: "For companies with many applications.",
    bundleIds: "20 bundle IDs",
    features: [
      "Everything in Team",
      "20 production bundle IDs",
      "Priority email support",
      "Dedicated onboarding",
    ],
    cta: "Buy License",
    highlighted: false,
    checkoutUrl: FACTORY_CHECKOUT_URL,
  },
  {
    name: "Enterprise",
    price: null,
    earlyBirdPrice: null,
    period: "",
    description: "For organizations with custom requirements.",
    bundleIds: "Unlimited bundle IDs",
    features: [
      "Everything in Factory",
      "Unlimited bundle IDs",
      "Dedicated support channel",
      "SLA agreement",
      "Custom integration help",
      "Invoice billing",
    ],
    cta: "Contact Us",
    highlighted: false,
    checkoutUrl: null,
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
            Launch pricing available for a limited time. Lock in{" "}
            <strong>$149</strong> (Indie), <strong>$229</strong> (Team)
            or <strong>$399</strong> (Factory) — valid for the first 3 months
            after launch.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const rawPrice = plan.earlyBirdPrice ?? plan.price;
            const displayPrice = rawPrice != null ? `$${rawPrice}` : "Custom";

            return (
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
                    ? `$${plan.earlyBirdPrice} early adopter price`
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
                {plan.checkoutUrl ? (
                  <CheckoutDialog
                    checkoutUrl={plan.checkoutUrl}
                    planName={plan.name}
                    price={displayPrice}
                    buttonVariant={plan.highlighted ? "default" : "outline"}
                    buttonLabel={plan.cta}
                  />
                ) : plan.price !== null ? (
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                    disabled
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
          );
          })}
        </div>

        {/* Info Grid */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Free Trial</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                No license key needed — 30 min sessions with all features included.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Perpetual License</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Buy once, use forever. 1 year of updates included. Bound to your bundle ID, validated offline.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Update Renewal (Optional)</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Renew after the first year for <strong>$99</strong> / <strong>$149</strong> / <strong>$249</strong>.
                Without renewal, your plugin continues to work.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Secure Checkout</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Powered by{" "}
                <a
                  href="https://www.lemonsqueezy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-2 hover:text-foreground"
                >
                  Lemon Squeezy
                </a>
                , our Merchant of Record. Your payment data is never stored on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Tax Note */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          All prices are exclusive of tax. VAT / sales tax will be calculated
          at checkout based on your location.
        </p>
      </div>
    </section>
  );
}
