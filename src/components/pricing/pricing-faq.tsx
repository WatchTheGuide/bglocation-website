import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "How does the 14-day trial work?",
    answer:
      "Install the plugin and start building immediately — no license key needed. The trial includes all features. When the trial expires the plugin stops tracking, but your app continues to function. Upgrade to a paid license to resume.",
  },
  {
    question: "What is a bundle ID and how are licenses bound?",
    answer:
      "A bundle ID is your app's unique identifier (e.g. com.yourcompany.app). Each license key is cryptographically bound to one or more bundle IDs (depending on your plan). The license is validated locally — no server call required, full offline support.",
  },
  {
    question: "Can I use one license for both iOS and Android?",
    answer:
      "Yes. A single bundle ID license covers both platforms as long as they share the same bundle identifier, which is the standard Capacitor setup.",
  },
  {
    question: "What happens if I need more bundle IDs later?",
    answer:
      "You can upgrade your plan at any time. Moving from Indie (1 bundle ID) to Team (5 bundle IDs) is a simple plan change — no code modifications required.",
  },
  {
    question: 'What does "Source Available" mean?',
    answer:
      "The plugin is distributed under the Elastic License v2 (ELv2). You get full access to the source code, can inspect it, and debug it. The three restrictions: you can't offer it as a competing hosted service, can't circumvent the license mechanism, and can't remove license notices.",
  },
  {
    question: "Do I need an internet connection for the license to work?",
    answer:
      "No. License validation is fully offline. The license key is verified using RSA-2048 cryptography on-device. There is no phone-home, no license server dependency.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and Apple Pay through our payment provider, Lemon Squeezy. Enterprise customers can also pay via invoice.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes. If the plugin doesn't work for your use case within 30 days of purchase, contact us for a full refund — no questions asked.",
  },
] as const;

export function PricingFaq() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-center text-muted-foreground">
          Everything you need to know about licensing and pricing.
        </p>

        <Accordion className="mt-12">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={index}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
