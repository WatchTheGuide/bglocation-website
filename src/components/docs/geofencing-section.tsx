"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";

const GEOFENCE_INTERFACE = `interface Geofence {
  identifier: string;              // unique ID
  latitude: number;
  longitude: number;
  radius: number;                  // meters (recommended min: 100m)
  notifyOnEntry?: boolean;         // default: true
  notifyOnExit?: boolean;          // default: true
  notifyOnDwell?: boolean;         // default: false
  dwellDelay?: number;             // seconds (default: 300)
  extras?: Record<string, string>; // custom metadata
}`;

const GEOFENCE_EVENT_INTERFACE = `interface GeofenceEvent {
  identifier: string;
  action: 'enter' | 'exit' | 'dwell';
  location: Location | null;
  extras?: Record<string, string>;
  timestamp: number;
}`;

const CAPACITOR_ADD = `import { BackgroundLocation } from '@bglocation/capacitor';

// Add a single geofence
await BackgroundLocation.addGeofence({
  identifier: 'office-hq',
  latitude: 52.2297,
  longitude: 21.0122,
  radius: 150,
  notifyOnEntry: true,
  notifyOnExit: true,
  notifyOnDwell: true,
  dwellDelay: 300,
  extras: { name: 'Headquarters', type: 'office' },
});`;

const REACT_NATIVE_ADD = `import { addGeofence } from '@bglocation/react-native';

// Add a single geofence
await addGeofence({
  identifier: 'office-hq',
  latitude: 52.2297,
  longitude: 21.0122,
  radius: 150,
  notifyOnEntry: true,
  notifyOnExit: true,
  notifyOnDwell: true,
  dwellDelay: 300,
  extras: { name: 'Headquarters', type: 'office' },
});`;

const CAPACITOR_BATCH = `// Add multiple geofences atomically (all-or-nothing)
await BackgroundLocation.addGeofences({
  geofences: [
    { identifier: 'store-1', latitude: 52.23, longitude: 21.01, radius: 100 },
    { identifier: 'store-2', latitude: 52.24, longitude: 21.02, radius: 100 },
    { identifier: 'store-3', latitude: 52.25, longitude: 21.03, radius: 100 },
  ],
});`;

const REACT_NATIVE_BATCH = `import { addGeofences } from '@bglocation/react-native';

// Add multiple geofences atomically (all-or-nothing)
await addGeofences({
  geofences: [
    { identifier: 'store-1', latitude: 52.23, longitude: 21.01, radius: 100 },
    { identifier: 'store-2', latitude: 52.24, longitude: 21.02, radius: 100 },
    { identifier: 'store-3', latitude: 52.25, longitude: 21.03, radius: 100 },
  ],
});`;

const CAPACITOR_MANAGE = `// Remove a specific geofence
await BackgroundLocation.removeGeofence({ identifier: 'store-1' });

// Remove all geofences
await BackgroundLocation.removeAllGeofences();

// List currently registered geofences
const { geofences } = await BackgroundLocation.getGeofences();
console.log('Active geofences:', geofences.length);`;

const REACT_NATIVE_MANAGE = `import {
  removeGeofence,
  removeAllGeofences,
  getGeofences,
} from '@bglocation/react-native';

// Remove a specific geofence
await removeGeofence({ identifier: 'store-1' });

// Remove all geofences
await removeAllGeofences();

// List currently registered geofences
const { geofences } = await getGeofences();
console.log('Active geofences:', geofences.length);`;

const CAPACITOR_LISTEN = `BackgroundLocation.addListener('onGeofence', (event) => {
  console.log(\`Geofence \${event.identifier}: \${event.action}\`);
  console.log('Location:', event.location?.latitude, event.location?.longitude);
  console.log('Extras:', event.extras);
  console.log('Timestamp:', new Date(event.timestamp).toISOString());
});`;

const REACT_NATIVE_LISTEN = `import { addListener } from '@bglocation/react-native';

addListener('onGeofence', (event) => {
  console.log(\`Geofence \${event.identifier}: \${event.action}\`);
  console.log('Location:', event.location?.latitude, event.location?.longitude);
  console.log('Extras:', event.extras);
  console.log('Timestamp:', new Date(event.timestamp).toISOString());
});`;

const METHODS = [
  { method: "addGeofence(geofence)", description: "Register a single geofence. Replaces existing geofence with the same identifier." },
  { method: "addGeofences({ geofences })", description: "Register multiple geofences atomically. Entire batch rejected if limit exceeded." },
  { method: "removeGeofence({ identifier })", description: "Remove a geofence by identifier. No-op if not found." },
  { method: "removeAllGeofences()", description: "Remove all registered geofences." },
  { method: "getGeofences()", description: "Return the list of currently registered geofences from the persistence layer." },
];

export function GeofencingSection() {
  const { framework } = useFramework();

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Geofencing Guide</h1>
        <FrameworkSwitcher compact />
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        Monitor circular regions and react to enter, exit, and dwell transitions. Geofencing works in the background on both iOS and Android, even when the app is terminated.
      </p>

      {/* Requirements */}
      <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium">Prerequisites</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">configure()</code> must be called before adding geofences.</li>
          <li>Location tracking does not need to be started — geofences work independently.</li>
          <li>Web platform is not supported — geofence methods reject with <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">UNSUPPORTED</code>.</li>
        </ul>
      </div>

      {/* Geofence Interface */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Geofence Interface</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{GEOFENCE_INTERFACE}</pre>
      </div>

      {/* Add a Geofence */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Add a Geofence</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_ADD : REACT_NATIVE_ADD}
        </pre>
      </div>

      {/* Batch Add */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Batch Add</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add multiple geofences in one call. This is atomic — if the total count would exceed 20, the entire batch is rejected.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_BATCH : REACT_NATIVE_BATCH}
        </pre>
      </div>

      {/* Manage Geofences */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Manage Geofences</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_MANAGE : REACT_NATIVE_MANAGE}
        </pre>
      </div>

      {/* Listen for Transitions */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Listen for Transitions</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_LISTEN : REACT_NATIVE_LISTEN}
        </pre>
        <h3 className="mt-6 font-semibold">GeofenceEvent</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{GEOFENCE_EVENT_INTERFACE}</pre>
      </div>

      {/* Dwell Detection */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Dwell Detection</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Dwell events fire when the device stays inside a geofence region for at least <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">dwellDelay</code> seconds (default: 300s = 5 minutes).
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Set <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">notifyOnDwell: true</code> to enable.</li>
          <li>Dwell works on both iOS and Android platforms.</li>
          <li>If the app is terminated before the dwell timer fires, the event is emitted on next app launch.</li>
        </ul>
      </div>

      {/* Region Limit */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">20 Region Limit</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Both iOS and Android limit the number of simultaneously active geofence regions to 20. The plugin enforces this limit and rejects <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">addGeofence</code> / <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">addGeofences</code> with <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">GEOFENCE_LIMIT_EXCEEDED</code> when the limit would be exceeded.
        </p>
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium">Dynamic Region Rotation Strategy</p>
          <p className="mt-1 text-sm text-muted-foreground">
            If your app needs more than 20 geofences, implement dynamic rotation: register the 20 closest regions to the user&apos;s current location, and swap them out as the user moves. Listen for <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onLocation</code> updates and call <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">removeGeofence</code> / <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">addGeofence</code> to rotate the nearest regions.
          </p>
        </div>
      </div>

      {/* Extras Metadata */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Extras Metadata</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Attach custom key-value pairs to geofences via the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">extras</code> field. Extras are returned in the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">GeofenceEvent</code> payload when the region triggers. Values must be strings — stringify numbers or booleans before passing.
        </p>
      </div>

      {/* API Methods */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Methods Summary</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Method</th>
                <th className="pb-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {METHODS.map((row) => (
                <tr key={row.method}>
                  <td className="py-3 pr-4"><code className="font-mono text-xs">{row.method}</code></td>
                  <td className="py-3 text-muted-foreground">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radius Tips */}
      <div className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium">Minimum Radius Recommendation</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Use a radius of at least 100 meters for reliable detection. Smaller radii may cause missed or delayed transitions, especially in areas with poor GPS signal (indoors, urban canyons).
        </p>
      </div>
    </div>
  );
}
