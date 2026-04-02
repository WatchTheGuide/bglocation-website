"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";
import { getFrameworkOption } from "@/lib/framework";

const CAPACITOR_FULL = `import { BackgroundLocation } from '@bglocation/capacitor';

// 1. Request permissions (Android: foreground first, then background)
await BackgroundLocation.requestPermissions({ permissions: ['location'] });
await BackgroundLocation.requestPermissions({ permissions: ['backgroundLocation'] });

// 2. Configure tracking
const result = await BackgroundLocation.configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  locationUpdateInterval: 5000,
  debug: true,
});

console.log('License mode:', result.licenseMode); // 'trial' or 'full'

// 3. Listen for location updates
BackgroundLocation.addListener('onLocation', (location) => {
  console.log(\`📍 \${location.latitude}, \${location.longitude}\`);
  console.log(\`   accuracy: \${location.accuracy}m, speed: \${location.speed}m/s\`);
});

// 4. Listen for heartbeats (fires even when stationary)
BackgroundLocation.addListener('onHeartbeat', (event) => {
  console.log('💓 Heartbeat:', event.location?.latitude, event.location?.longitude);
});

// 5. Start tracking
await BackgroundLocation.start();

// 6. Stop tracking when done
// await BackgroundLocation.stop();
// await BackgroundLocation.removeAllListeners();`;

const REACT_NATIVE_FULL = `import {
  addListener,
  configure,
  requestPermissions,
  start,
  stop,
  removeAllListeners,
} from '@bglocation/react-native';

// 1. Request permissions (Android: foreground first, then background)
await requestPermissions({ permissions: ['location'] });
await requestPermissions({ permissions: ['backgroundLocation'] });

// 2. Configure tracking
const result = await configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  locationUpdateInterval: 5000,
  debug: true,
});

console.log('License mode:', result.licenseMode); // 'trial' or 'full'

// 3. Listen for location updates
const locationSub = addListener('onLocation', (location) => {
  console.log(\`📍 \${location.latitude}, \${location.longitude}\`);
  console.log(\`   accuracy: \${location.accuracy}m, speed: \${location.speed}m/s\`);
});

// 4. Listen for heartbeats (fires even when stationary)
const heartbeatSub = addListener('onHeartbeat', (event) => {
  console.log('💓 Heartbeat:', event.location?.latitude, event.location?.longitude);
});

// 5. Start tracking
await start();

// 6. Stop tracking when done
// locationSub.remove();
// heartbeatSub.remove();
// await stop();
// removeAllListeners();`;

export function QuickStartSection() {
  const { framework } = useFramework();
  const frameworkOption = getFrameworkOption(framework);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Quick Start</h1>
        <FrameworkSwitcher compact />
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        Go from zero to working background location tracking in 5 minutes. Copy the full snippet below into your {frameworkOption.label} app.
      </p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">1. Install</h2>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor"
            ? `npm install @bglocation/capacitor\nnpx cap sync`
            : `npm install @bglocation/react-native\nnpx expo prebuild\n\n# Bare React Native (no Expo)\ncd ios && pod install`}
        </pre>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">2. Complete Working Example</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a complete, copy-paste-ready snippet. No license key required — the plugin runs in trial mode (30 minutes of full functionality, then 1-hour cooldown).
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed">
          {framework === "capacitor" ? CAPACITOR_FULL : REACT_NATIVE_FULL}
        </pre>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">3. Run on Device</h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium">Important: Test on a Physical Device</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Background location tracking requires a real device. Simulators do not reliably generate background location updates or test native background execution.
            </p>
          </div>

          <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
            {framework === "capacitor"
              ? `# iOS\nnpx cap run ios --target <device-id>\n\n# Android\nnpx cap run android --target <device-id>`
              : `# iOS\nnpx expo run:ios --device\n\n# Android\nnpx expo run:android --device`}
          </pre>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">What&apos;s Next?</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>
            <strong>Configure tracking</strong> — Fine-tune distance filter, accuracy, and heartbeat in the{" "}
            <a href="/docs/background-tracking" className="text-primary underline underline-offset-2">Background Tracking</a> guide.
          </li>
          <li>
            <strong>Send data to your server</strong> — Enable native HTTP posting in the{" "}
            <a href="/docs/http-posting" className="text-primary underline underline-offset-2">HTTP Posting</a> guide.
          </li>
          <li>
            <strong>Set up geofences</strong> — Monitor circular regions in the{" "}
            <a href="/docs/geofencing" className="text-primary underline underline-offset-2">Geofencing</a> guide.
          </li>
          <li>
            <strong>Add your license key</strong> — Remove trial restrictions in the{" "}
            <a href="/docs/licensing" className="text-primary underline underline-offset-2">Licensing</a> guide.
          </li>
        </ul>
      </div>
    </div>
  );
}
