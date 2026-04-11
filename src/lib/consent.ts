"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY_V1 = "bgl_cookie_consent_v1";
const STORAGE_KEY_V2 = "bgl_cookie_consent_v2";
const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000; // 365 days
const SERVER_SNAPSHOT = "__BGL_SSR__";

export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  timestamp: number;
};

const listeners = new Set<() => void>();
let memoryFallback: string | null = null;
let storageBroken = false;

function emitChange() {
  for (const listener of listeners) listener();
}

function readRaw(): string | null {
  try {
    return storageBroken
      ? memoryFallback
      : localStorage.getItem(STORAGE_KEY_V2);
  } catch {
    return memoryFallback;
  }
}

function writeRaw(value: string) {
  memoryFallback = value;
  try {
    localStorage.setItem(STORAGE_KEY_V2, value);
    storageBroken = false;
    memoryFallback = null;
  } catch {
    storageBroken = true;
  }
}

function removeRaw() {
  memoryFallback = null;
  storageBroken = false;
  try {
    localStorage.removeItem(STORAGE_KEY_V2);
  } catch {
    // noop
  }
}

function migrateV1(): void {
  try {
    const v1 = localStorage.getItem(STORAGE_KEY_V1);
    if (v1 !== null) {
      localStorage.removeItem(STORAGE_KEY_V1);
      // v1 existed → user previously dismissed banner
      // Per GDPR Art. 7 — new category requires new consent, so we don't auto-grant analytics
      // Banner will re-appear because v2 is still null
    }
  } catch {
    // noop
  }
}

function getSnapshot(): string | null {
  return readRaw();
}

function getServerSnapshot(): string | null {
  return SERVER_SNAPSHOT;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);

  if (listeners.size === 1) {
    migrateV1();
  }

  function handleStorage(event: StorageEvent) {
    if (event.storageArea === localStorage && event.key === STORAGE_KEY_V2) {
      callback();
    }
  }

  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export function parseConsent(raw: string | null): ConsentPreferences | null {
  if (raw === null || raw === SERVER_SNAPSHOT) return null;
  try {
    const parsed = JSON.parse(raw) as ConsentPreferences;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      parsed.necessary === true &&
      typeof parsed.analytics === "boolean" &&
      typeof parsed.timestamp === "number"
    ) {
      return parsed;
    }
  } catch {
    // corrupted data
  }
  return null;
}

export function isConsentExpired(consent: ConsentPreferences | null): boolean {
  if (consent === null) return false;
  return Date.now() - consent.timestamp >= CONSENT_TTL_MS;
}

export function saveConsent(analytics: boolean): void {
  const preferences: ConsentPreferences = {
    necessary: true,
    analytics,
    timestamp: Date.now(),
  };
  writeRaw(JSON.stringify(preferences));
  emitChange();
}

export function resetConsent(): void {
  removeRaw();
  emitChange();
}

export function useConsent() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const consent = parseConsent(raw);
  const expired = isConsentExpired(consent);

  return {
    /** Parsed consent preferences, null if not yet given or expired */
    consent: expired ? null : consent,
    /** Whether the banner should be shown */
    shouldShowBanner: consent === null || expired,
    /** Whether analytics consent was granted (and not expired) */
    analyticsAllowed: consent !== null && !expired && consent.analytics,
  };
}

export { STORAGE_KEY_V2 as CONSENT_STORAGE_KEY, CONSENT_TTL_MS };
