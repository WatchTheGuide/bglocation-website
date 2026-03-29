"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFramework } from "@/components/framework/framework-provider";

const STORAGE_KEY = "bgl_cookie_consent_v1";
const CONSENT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return "server";
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function isExpired(value: string | null): boolean {
  if (!value || value === "server") return false;
  const timestamp = Number(value);
  if (Number.isNaN(timestamp)) return true;
  return Date.now() - timestamp > CONSENT_TTL_MS;
}

export function CookieBanner() {
  const storedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { frameworkHref } = useFramework();

  const shouldShow = storedValue === null || isExpired(storedValue);

  useEffect(() => {
    if (!storedValue || storedValue === "server") return;
    const timestamp = Number(storedValue);
    if (Number.isNaN(timestamp)) return;
    const remaining = CONSENT_TTL_MS - (Date.now() - timestamp);
    if (remaining <= 0) return;
    const timer = setTimeout(emitChange, remaining);
    return () => clearTimeout(timer);
  }, [storedValue]);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // silently ignore if localStorage is unavailable
    }
    emitChange();
  }

  if (!shouldShow) return null;

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
            href={frameworkHref("/cookies")}
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
