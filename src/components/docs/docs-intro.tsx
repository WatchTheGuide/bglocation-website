"use client";

import Link from "next/link";
import {
  BookOpen,
  Code,
  Download,
  MapPin,
  Settings,
  Shield,
} from "lucide-react";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";
import { useFramework } from "@/components/framework/framework-provider";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFrameworkOption } from "@/lib/framework";

const DOC_SECTIONS = [
  {
    title: "Getting Started",
    description: "Installation, configuration, and your first location track.",
    icon: Download,
    href: "#getting-started",
  },
  {
    title: "Configuration",
    description: "Tracking, intervals, HTTP posting, notification, and adaptive filter.",
    icon: Settings,
    href: "#configuration",
  },
  {
    title: "API Reference",
    description: "Methods, events, and types for the active framework wrapper.",
    icon: Code,
    href: "#api-reference",
  },
  {
    title: "Platform Guides",
    description: "iOS and Android setup, permissions, background modes, and Expo notes.",
    icon: MapPin,
    href: "#platform-guides",
  },
  {
    title: "Licensing",
    description: "Trial mode, offline validation, and where to place your license key.",
    icon: Shield,
    href: "#licensing",
  },
  {
    title: "Examples",
    description: "Production-flavored snippets for tracking, HTTP, fitness, and geofencing.",
    icon: BookOpen,
    href: "#examples",
  },
] as const;

export function DocsIntro() {
  const { framework, frameworkHref } = useFramework();
  const frameworkOption = getFrameworkOption(framework);

  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Documentation</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
          Everything you need to integrate background location tracking into your {frameworkOption.label} app.
          The native core stays the same. The wrapper and setup flow adapt to your stack.
        </p>
        <div className="mt-6 flex justify-center">
          <FrameworkSwitcher />
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-2xl border bg-muted/30 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Quick Install
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <code className="block rounded-xl bg-background px-4 py-3 font-mono text-sm shadow-sm">
            {frameworkOption.installCommand}
          </code>
          <code className="block rounded-xl bg-background px-4 py-3 font-mono text-sm shadow-sm">
            {frameworkOption.secondaryInstallCommand}
          </code>
        </div>
        {framework === "react-native" ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Expo projects should use the config plugin plus a dev client. Bare React Native apps still need
            <span className="font-mono"> cd ios && pod install</span> after installation.
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Keep <span className="font-mono">capacitor.config.ts</span> in sync with your native apps and rerun
            sync after changing plugin config or license settings.
          </p>
        )}
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DOC_SECTIONS.map((section) => (
          <Link key={section.title} href={frameworkHref(`/docs${section.href}`)}>
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
    </>
  );
}
