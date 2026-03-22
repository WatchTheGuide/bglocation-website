import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:py-40">
        <Badge variant="secondary" className="mb-4">
          Capacitor 8 &middot; iOS &middot; Android
        </Badge>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Background Location{" "}
          <span className="text-primary">That Just Works</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Production-ready Capacitor plugin for continuous GPS tracking on iOS
          and Android. Native HTTP posting, offline buffer, heartbeat timer —
          all in one package.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button render={<Link href="/pricing" />} nativeButton={false} size="lg">
            Get License — from $149
          </Button>
          <Button render={<Link href="/docs" />} nativeButton={false} variant="outline" size="lg">
            Read the Docs
          </Button>
        </div>

        <div className="mt-8">
          <code className="rounded-md bg-muted px-4 py-2 font-mono text-sm text-muted-foreground">
            npm install capacitor-bglocation
          </code>
        </div>
      </div>
    </section>
  );
}
