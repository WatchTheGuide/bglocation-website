"use client";

import { Button } from "@/components/ui/button";
import { resetConsent } from "@/lib/consent";

export function ManageCookiePreferences() {
  return (
    <Button variant="outline" onClick={resetConsent}>
      Manage cookie preferences
    </Button>
  );
}
