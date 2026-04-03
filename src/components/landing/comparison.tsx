"use client";

import { Check, Minus, X } from "lucide-react";
import { useFramework } from "@/components/framework/framework-provider";
import { Badge } from "@/components/ui/badge";

const CAPACITOR_ROWS = [
  { feature: "Background GPS tracking", us: true, community: "partial" },
  { feature: "Native HTTP posting", us: true, community: false },
  { feature: "Offline buffer (SQLite)", us: true, community: false },
  { feature: "Heartbeat timer", us: true, community: false },
  { feature: "Adaptive distance filter", us: true, community: false },
  { feature: "Capacitor 8 native", us: true, community: true },
  { feature: "No Cordova legacy code", us: true, community: true },
  { feature: "Battery optimization detection", us: true, community: false },
  { feature: "Offline license (no phone-home)", us: true, community: "n/a" },
  { feature: "Source available", us: "ELv2", community: "MIT" },
  { feature: "Runs when app is killed", us: true, community: false },
  { feature: "Geofencing", us: true, community: false },
  { feature: "License type", us: "Perpetual", community: "n/a" },
] as const;

const REACT_NATIVE_ROWS = [
  { feature: "Background GPS tracking", us: true, community: "partial" },
  { feature: "Native HTTP posting", us: true, community: false },
  { feature: "Offline buffer (SQLite)", us: true, community: false },
  { feature: "Heartbeat timer", us: true, community: false },
  { feature: "Adaptive distance filter", us: true, community: false },
  { feature: "TurboModule wrapper", us: true, community: false },
  { feature: "Expo config plugin", us: true, community: false },
  { feature: "Battery optimization detection", us: true, community: false },
  { feature: "Offline license (no phone-home)", us: true, community: "n/a" },
  { feature: "Source available", us: "ELv2", community: "MIT" },
  { feature: "Runs when app is killed", us: true, community: false },
  { feature: "Geofencing", us: true, community: false },
  { feature: "License type", us: "Perpetual", community: "n/a" },
] as const;

export function Comparison() {
  const { framework } = useFramework();
  const comparisonLabel = framework === "capacitor" ? "@capacitor/geolocation" : "expo-location";
  const rows = framework === "capacitor" ? CAPACITOR_ROWS : REACT_NATIVE_ROWS;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How We Compare
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Compare the active wrapper against the closest built-in baseline for the same ecosystem.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[50%]" />
              <col className="w-[25%]" />
              <col className="w-[25%]" />
            </colgroup>
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left font-medium text-muted-foreground">
                  Feature
                </th>
                <th className="pb-3 text-center font-medium">
                  <span className="block">bglocation</span>
                  <Badge variant="secondary" className="mt-1">
                    recommended
                  </Badge>
                </th>
                <th className="pb-3 text-center font-medium text-muted-foreground">
                  <span className="block">{comparisonLabel}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className="border-b">
                  <td className="py-3 text-muted-foreground">{row.feature}</td>
                  <td className="py-3 text-center">
                    <ComparisonCell value={row.us} />
                  </td>
                  <td className="py-3 text-center">
                    <ComparisonCell value={row.community} muted />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {framework === "capacitor"
            ? "@capacitor/geolocation is the official Capacitor plugin — solid for foreground location, but limited for persistent background tracking when the app is suspended or killed."
            : "expo-location is convenient for standard location flows, but it does not provide the same native background tracking, offline delivery, and production-focused feature set."}
        </p>
      </div>
    </section>
  );
}

function ComparisonCell({
  value,
  muted = false,
}: {
  value: boolean | string;
  muted?: boolean;
}) {
  if (value === "partial") {
    return (
      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
        <Minus className="h-4 w-4" />
        <span className="text-xs">limited</span>
      </span>
    );
  }
  if (value === "n/a") {
    return <span className="text-xs text-muted-foreground/50">n/a</span>;
  }
  if (typeof value === "string") {
    return (
      <span className={muted ? "text-muted-foreground" : "font-semibold"}>
        {value}
      </span>
    );
  }
  return value ? (
    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
  ) : (
    <X className="mx-auto h-5 w-5 text-muted-foreground/40" />
  );
}
