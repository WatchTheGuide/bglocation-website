"use client";

import { type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { resetConsent } from "@/lib/consent";

type Props = Omit<ComponentProps<typeof Button>, "onClick">;

export function ManageCookiePreferences(props: Props) {
  return (
    <Button onClick={resetConsent} {...props}>
      {props.children ?? "Manage cookie preferences"}
    </Button>
  );
}
