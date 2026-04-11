"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFramework } from "@/components/framework/framework-provider";
import { useConsent, saveConsent } from "@/lib/consent";

export function CookieBanner() {
  const { shouldShowBanner } = useConsent();
  const { frameworkHref } = useFramework();

  if (!shouldShowBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          This site uses essential cookies for authentication and optional
          analytics to improve the experience.{" "}
          <Link
            href={frameworkHref("/cookies")}
            className="underline hover:text-foreground"
          >
            Learn more
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            onClick={() => saveConsent(false)}
            size="sm"
            variant="outline"
          >
            Essential only
          </Button>
          <Button
            onClick={() => saveConsent(true)}
            size="sm"
          >
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
