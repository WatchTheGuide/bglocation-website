"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "bgl_cookie_consent_v1";
const CONSENT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function isConsentExpired(): boolean {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return true;
    const timestamp = Number(value);
    if (Number.isNaN(timestamp)) return true;
    return Date.now() - timestamp > CONSENT_TTL_MS;
  } catch {
    return true;
  }
}

function getSnapshot(): boolean {
  return isConsentExpired();
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function CookieBanner() {
  const shouldShow = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // silently ignore if localStorage is unavailable
    }
  }

  if (!shouldShow || dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          This site uses essential cookies for authentication only. No tracking
          or analytics cookies are used.{" "}
          <Link
            href="/cookies"
            className="underline hover:text-foreground"
          >
            Learn more
          </Link>
        </p>
        <Button
          onClick={dismiss}
          size="sm"
          variant="outline"
          className="shrink-0"
        >
          Got it
        </Button>
      </div>
    </div>
  );
}
