"use client";

import { Analytics } from "@vercel/analytics/next";
import { useConsent } from "@/lib/consent";

export function ConditionalAnalytics() {
  const { analyticsAllowed } = useConsent();

  if (!analyticsAllowed) return null;

  return <Analytics mode="production" />;
}
