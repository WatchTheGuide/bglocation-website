"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";

const CORE_OPTIONS = [
  {
    option: "distanceFilter",
    type: "number | 'auto'",
    defaultValue: "15",
    description: "Minimum distance in meters between location updates. Use 'auto' for speed-adaptive mode.",
  },
  {
    option: "desiredAccuracy",
    type: "'high' | 'balanced' | 'low'",
    defaultValue: "'high'",
    description: "Accuracy preset. 'high' uses GPS, 'balanced' uses Wi-Fi/cell, 'low' uses passive provider.",
  },
  {
    option: "heartbeatInterval",
    type: "number",
    defaultValue: "15",
    description: "Interval in seconds between heartbeat events. Fires even when stationary.",
  },
  {
    option: "locationUpdateInterval",
    type: "number",
    defaultValue: "5000",
    description: "Android-only: requested update interval in milliseconds.",
  },
  {
    option: "fastestLocationUpdateInterval",
    type: "number",
    defaultValue: "2000",
    description: "Android-only: fastest allowed update interval in milliseconds.",
  },
];

const USE_CASE_RECOMMENDATIONS = [
  {
    useCase: "Fleet / Delivery",
    distanceFilter: "'auto' or 50–100",
    heartbeat: "30–60",
    accuracy: "'high'",
    notes: "Adaptive filter adjusts to vehicle speed. HTTP posting with buffer recommended.",
  },
  {
    useCase: "Fitness / Running",
    distanceFilter: "5–15",
    heartbeat: "10–15",
    accuracy: "'high'",
    notes: "Low distance filter for accurate polyline. High battery drain acceptable.",
  },
  {
    useCase: "General Tracking",
    distanceFilter: "15–30",
    heartbeat: "15–30",
    accuracy: "'high'",
    notes: "Good balance of accuracy and battery life.",
  },
  {
    useCase: "Geofence-Only",
    distanceFilter: "50–100",
    heartbeat: "60",
    accuracy: "'balanced'",
    notes: "Location updates are secondary. Focus on geofence transitions.",
  },
];

const CAPACITOR_EXAMPLE = `import { BackgroundLocation } from '@bglocation/capacitor';

await BackgroundLocation.configure({
  distanceFilter: 15,           // meters (or 'auto')
  desiredAccuracy: 'high',      // GPS-level accuracy
  heartbeatInterval: 15,        // seconds
  locationUpdateInterval: 5000, // Android only: ms
  fastestLocationUpdateInterval: 2000,
});

BackgroundLocation.addListener('onLocation', (location) => {
  console.log(location.latitude, location.longitude);
  console.log('Moving:', location.isMoving, 'Speed:', location.speed);
});

BackgroundLocation.addListener('onHeartbeat', (event) => {
  console.log('Heartbeat at:', event.timestamp);
  if (event.location) {
    console.log('Last known:', event.location.latitude, event.location.longitude);
  }
});

await BackgroundLocation.start();`;

const REACT_NATIVE_EXAMPLE = `import { addListener, configure, start } from '@bglocation/react-native';

await configure({
  distanceFilter: 15,           // meters (or 'auto')
  desiredAccuracy: 'high',      // GPS-level accuracy
  heartbeatInterval: 15,        // seconds
  locationUpdateInterval: 5000, // Android only: ms
  fastestLocationUpdateInterval: 2000,
});

addListener('onLocation', (location) => {
  console.log(location.latitude, location.longitude);
  console.log('Moving:', location.isMoving, 'Speed:', location.speed);
});

addListener('onHeartbeat', (event) => {
  console.log('Heartbeat at:', event.timestamp);
  if (event.location) {
    console.log('Last known:', event.location.latitude, event.location.longitude);
  }
});

await start();`;

export function BackgroundTrackingSection() {
  const { framework } = useFramework();

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Background Location Tracking</h1>
        <FrameworkSwitcher compact />
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        Configure the tracking engine: distance filter, heartbeat interval, accuracy level, and understand their impact on battery.
      </p>

      {/* Core Options Table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Configuration Options</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          All options are passed to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">configure()</code>.
          Subsequent calls merge with the previous configuration — pass only the fields you want to change.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Option</th>
                <th className="pb-3 pr-4 font-semibold">Type</th>
                <th className="pb-3 pr-4 font-semibold">Default</th>
                <th className="pb-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {CORE_OPTIONS.map((row) => (
                <tr key={row.option}>
                  <td className="py-3 pr-4"><code className="font-mono text-xs">{row.option}</code></td>
                  <td className="py-3 pr-4 text-muted-foreground"><code className="font-mono text-xs">{row.type}</code></td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.defaultValue}</td>
                  <td className="py-3 text-muted-foreground">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distance Filter */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Distance Filter: Fixed vs Auto</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Fixed Distance Filter</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Set a constant minimum distance (e.g., 15 meters). The native location manager only delivers updates when the device has moved at least this far. Best when your required precision is constant regardless of speed.
            </p>
            <pre className="mt-3 rounded bg-muted p-3 font-mono text-xs">distanceFilter: 15</pre>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Auto Distance Filter</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The filter adjusts automatically based on the device&apos;s speed. Slower movement means smaller filter (more precision), faster movement means larger filter (less battery drain). Ideal for mixed-mode transport.
            </p>
            <pre className="mt-3 rounded bg-muted p-3 font-mono text-xs">{`distanceFilter: 'auto',\nautoDistanceFilter: {\n  targetInterval: 10,\n  minDistance: 10,\n  maxDistance: 500,\n}`}</pre>
          </div>
        </div>
      </div>

      {/* Heartbeat */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Heartbeat Timer</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The heartbeat fires at a fixed interval regardless of movement. Each heartbeat includes the last known location (or <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">null</code> if none acquired yet). Use heartbeats to:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Confirm the device is still alive and tracking</li>
          <li>Detect stationary periods (no onLocation events between heartbeats)</li>
          <li>Trigger server-side logic on a schedule independent of movement</li>
        </ul>
      </div>

      {/* Use Case Recommendations */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Recommended Settings by Use Case</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Use Case</th>
                <th className="pb-3 pr-4 font-semibold">Distance Filter</th>
                <th className="pb-3 pr-4 font-semibold">Heartbeat (s)</th>
                <th className="pb-3 pr-4 font-semibold">Accuracy</th>
                <th className="pb-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {USE_CASE_RECOMMENDATIONS.map((row) => (
                <tr key={row.useCase}>
                  <td className="py-3 pr-4 font-medium">{row.useCase}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.distanceFilter}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.heartbeat}</td>
                  <td className="py-3 pr-4 text-muted-foreground"><code className="font-mono text-xs">{row.accuracy}</code></td>
                  <td className="py-3 text-muted-foreground">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Battery Impact */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Battery Impact</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Background location tracking consumes battery. The most impactful settings are:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li><strong>desiredAccuracy: &apos;high&apos;</strong> — GPS hardware stays active. Highest battery drain but best accuracy.</li>
          <li><strong>Small distanceFilter</strong> — More frequent updates = more CPU wake-ups.</li>
          <li><strong>Short heartbeatInterval</strong> — Frequent timer fires keep the process active.</li>
          <li><strong>HTTP posting</strong> — Network I/O adds to power consumption, but native posting is more efficient than JS-side fetch calls.</li>
        </ul>
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium">Tip: Balance Accuracy and Battery</p>
          <p className="mt-1 text-sm text-muted-foreground">
            For most apps, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">distanceFilter: &apos;auto&apos;</code> with default settings provides the best trade-off. It automatically reduces updates when stationary and increases them during movement.
          </p>
        </div>
      </div>

      {/* Full Example */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Complete Example</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed">
          {framework === "capacitor" ? CAPACITOR_EXAMPLE : REACT_NATIVE_EXAMPLE}
        </pre>
      </div>
    </div>
  );
}
