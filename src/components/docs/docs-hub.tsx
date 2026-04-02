"use client";

import Link from "next/link";
import {
  BookOpen,
  Bug,
  Code,
  Compass,
  Download,
  Globe,
  Key,
  Locate,
  MapPin,
  MoveRight,
  Radio,
  Send,
  Settings,
  Shield,
  Sliders,
  TriangleAlert,
} from "lucide-react";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";
import { useFramework } from "@/components/framework/framework-provider";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFrameworkOption } from "@/lib/framework";
import { DOC_GROUPS, DOC_PAGES } from "@/lib/docs-navigation";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "quick-start": Download,
  "background-tracking": Locate,
  "http-posting": Send,
  geofencing: MapPin,
  permissions: Shield,
  "adaptive-filter": Sliders,
  "debug-mode": Bug,
  licensing: Key,
  "platform-differences": Globe,
  "error-codes": TriangleAlert,
  examples: BookOpen,
  troubleshooting: Settings,
  migration: MoveRight,
  "api-reference": Code,
};

export function DocsHub() {
  const { framework, frameworkHref } = useFramework();
  const frameworkOption = getFrameworkOption(framework);

  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Documentation
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
          Everything you need to integrate background location tracking into
          your {frameworkOption.label} app. The native core stays the same. The
          wrapper and setup flow adapt to your stack.
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
            Expo projects should use the config plugin plus a dev client. Bare
            React Native apps still need
            <span className="font-mono"> cd ios && pod install</span> after
            installation.
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Keep{" "}
            <span className="font-mono">capacitor.config.ts</span> in
            sync with your native apps and rerun sync after changing plugin
            config or license settings.
          </p>
        )}
      </div>

      {DOC_GROUPS.map((group) => {
        const pages = DOC_PAGES.filter((p) => p.group === group.key);
        if (pages.length === 0) return null;

        return (
          <div key={group.key} className="mt-12">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {group.label}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => {
                const Icon = ICONS[page.slug] ?? Compass;
                return (
                  <Link
                    key={page.slug}
                    href={frameworkHref(`/docs/${page.slug}`)}
                  >
                    <Card className="h-full transition-colors hover:border-primary/50">
                      <CardHeader>
                        <Icon className="mb-2 h-7 w-7 text-primary" />
                        <CardTitle className="text-lg">
                          {page.shortTitle}
                        </CardTitle>
                        <CardDescription>{page.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
