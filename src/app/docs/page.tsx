import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Code,
  Download,
  MapPin,
  Settings,
  Shield,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Guides, API reference, and examples for capacitor-bglocation — the production-ready background location plugin for Capacitor.",
};

const DOC_SECTIONS = [
  {
    title: "Getting Started",
    description: "Installation, configuration, and your first location track.",
    icon: Download,
    href: "/docs",
  },
  {
    title: "Configuration",
    description:
      "All plugin options: distance filter, accuracy, intervals, HTTP posting.",
    icon: Settings,
    href: "/docs",
  },
  {
    title: "API Reference",
    description: "Complete TypeScript API: methods, events, and type definitions.",
    icon: Code,
    href: "/docs",
  },
  {
    title: "Platform Guides",
    description:
      "iOS and Android specifics: permissions, background modes, battery optimization.",
    icon: MapPin,
    href: "/docs",
  },
  {
    title: "Licensing",
    description:
      "How license keys work, trial mode, offline validation, and key management.",
    icon: Shield,
    href: "/docs",
  },
  {
    title: "Examples",
    description:
      "Real-world examples: fleet tracking, fitness apps, delivery apps.",
    icon: BookOpen,
    href: "/docs",
  },
] as const;

export default function DocsPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Documentation
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to integrate background location tracking into
            your Capacitor app.
          </p>
        </div>

        {/* Quick Install */}
        <div className="mx-auto mt-12 max-w-2xl rounded-lg border bg-muted/30 p-6">
          <h2 className="text-lg font-semibold">Quick Install</h2>
          <code className="mt-3 block rounded-md bg-muted px-4 py-3 font-mono text-sm">
            npm install capacitor-bglocation
          </code>
          <code className="mt-2 block rounded-md bg-muted px-4 py-3 font-mono text-sm">
            npx cap sync
          </code>
        </div>

        {/* Doc Sections Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOC_SECTIONS.map((section) => (
            <Link key={section.title} href={section.href}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <section.icon className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Coming Soon Note */}
        <div className="mt-16 rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">
            Full documentation coming soon
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Comprehensive guides and API reference are being prepared. In the
            meantime, check the{" "}
            <a
              href="https://www.npmjs.com/package/capacitor-bglocation"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4"
            >
              README on npm
            </a>{" "}
            for usage instructions.
          </p>
        </div>
      </div>
    </section>
  );
}
