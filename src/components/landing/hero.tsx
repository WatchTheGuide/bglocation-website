"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFramework } from "@/components/framework/framework-provider";
import { getFrameworkOption } from "@/lib/framework";

export function Hero() {
  const { framework, frameworkHref } = useFramework();
  const frameworkOption = getFrameworkOption(framework);

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:py-40">
        <Badge variant="secondary" className="mb-4">
          Capacitor 8 &middot; React Native &middot; iOS &middot; Android
        </Badge>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Background Location{" "}
          <span className="text-primary">That Just Works</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Production-ready SDK for continuous GPS tracking on iOS and Android.
          Ship the same native location core through a Capacitor plugin or a
          React Native wrapper, with native HTTP posting, offline buffer,
          heartbeat timer, and geofencing built in.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button render={<Link href={frameworkHref("/pricing")} />} nativeButton={false} size="lg">
            Get License — from $149
          </Button>
          <Button
            render={<Link href={frameworkHref("/docs")} />}
            nativeButton={false}
            variant="outline"
            size="lg"
          >
            Read the Docs
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Launching <strong>April 27, 2026</strong> — install &amp; try with trial mode today
        </p>

        <p className="mt-4 text-sm text-muted-foreground">
          Currently focused on <strong>{frameworkOption.platformSummary}</strong>
        </p>

        <div className="mt-4">
          <code className="rounded-md bg-muted px-4 py-2 font-mono text-sm text-muted-foreground">
            {frameworkOption.installCommand}
          </code>
        </div>
      </div>
    </section>
  );
}
