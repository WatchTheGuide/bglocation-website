import { Badge } from "@/components/ui/badge";
import { Check, X, Minus } from "lucide-react";

const ROWS = [
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

export function Comparison() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How We Compare
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            See how we stack up against the built-in Capacitor geolocation plugin.
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
                  <span className="block">capacitor-bglocation</span>
                  <Badge variant="secondary" className="mt-1">
                    recommended
                  </Badge>
                </th>
                <th className="pb-3 text-center font-medium text-muted-foreground">
                  <span className="block">@capacitor/</span>
                  <span className="block">geolocation</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
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
          @capacitor/geolocation is the official Capacitor plugin — great for foreground location,
          but limited background support (no persistent tracking when the app is suspended/killed).
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
      <span className="inline-flex items-center gap-1 text-amber-600">
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
    <Check className="mx-auto h-5 w-5 text-green-600" />
  ) : (
    <X className="mx-auto h-5 w-5 text-muted-foreground/40" />
  );
}
