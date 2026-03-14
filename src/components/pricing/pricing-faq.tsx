import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "How does trial mode work?",
    answer:
      "Install the plugin and start building immediately — no license key needed. Trial mode includes all features but limits tracking to 30 minutes per session with a 1-hour cooldown between sessions. Debug mode is forced on. When the session expires, tracking stops automatically and an onTrialExpired event is emitted. After the cooldown, you can start another 30-minute session. Buy a license to remove all restrictions.",
  },
  {
    question: "What is a bundle ID and how are licenses bound?",
    answer:
      "A bundle ID is your app's unique identifier (e.g. com.yourcompany.app). Each license key is cryptographically bound to exactly one bundle ID — the Indie plan includes 1 key, Team includes 5, and Factory includes 20. The license is validated entirely on-device using RSA-2048 — no server calls, no phone-home, full offline support.",
  },
  {
    question: "Can I use one license for both iOS and Android?",
    answer:
      "Yes. A single bundle ID license covers both platforms as long as they share the same bundle identifier, which is the standard Capacitor setup.",
  },
  {
    question: "What happens if I need more bundle IDs later?",
    answer:
      "You can upgrade your plan at any time. Moving from Indie (1 bundle ID) to Team (5) or Factory (20) is a simple plan change — no code modifications required.",
  },
  {
    question: "What happens after the first year?",
    answer:
      "Your license is perpetual — the plugin continues to work without any restrictions, forever. After 1 year, you lose access to new plugin updates. To get another year of updates and support, you can purchase a renewal at a discounted rate.",
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
      "All sales are final. Since the plugin can be fully evaluated in trial mode — with all features available — before purchasing, we expect every purchase to be a deliberate decision. If you encounter a technical issue that prevents the plugin from working as documented, contact us and we'll do our best to help.",
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
