"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";

const CAPACITOR_LICENSE_SNIPPET = `// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.app',
  plugins: {
    BackgroundLocation: {
      licenseKey: 'BGL1-eyJ...',
    },
  },
};

export default config;`;

const EXPO_LICENSE_SNIPPET = `// app.json
{
  "expo": {
    "plugins": [
      [
        "@bglocation/react-native",
        {
          "licenseKey": "BGL1-eyJ..."
        }
      ]
    ]
  }
}`;

const BARE_RN_LICENSE_SNIPPET = `<!-- iOS: Info.plist -->
<key>BGLocationLicenseKey</key>
<string>BGL1-eyJ...</string>

<!-- Android: AndroidManifest.xml -->
<meta-data
  android:name="dev.bglocation.LICENSE_KEY"
  android:value="BGL1-eyJ..." />`;

const CAPACITOR_RESULT = `const result = await BackgroundLocation.configure({ ... });

console.log(result.licenseMode);          // 'full' | 'trial'
console.log(result.licenseUpdatesUntil);  // '2026-01-15' (if licensed)
console.log(result.licenseUpdateExpired); // true if updates expired
console.log(result.licenseError);         // string if validation failed`;

const REACT_NATIVE_RESULT = `const result = await configure({ ... });

console.log(result.licenseMode);          // 'full' | 'trial'
console.log(result.licenseUpdatesUntil);  // '2026-01-15' (if licensed)
console.log(result.licenseUpdateExpired); // true if updates expired
console.log(result.licenseError);         // string if validation failed`;

const CAPACITOR_TRIAL_EXPIRED = `BackgroundLocation.addListener('onTrialExpired', (event) => {
  console.log('Trial ended at', new Date(event.timestamp));
  // Tracking has been stopped automatically.
  // Next trial available after 1-hour cooldown.
});`;

const REACT_NATIVE_TRIAL_EXPIRED = `addListener('onTrialExpired', (event) => {
  console.log('Trial ended at', new Date(event.timestamp));
  // Tracking has been stopped automatically.
  // Next trial available after 1-hour cooldown.
});`;

export function LicensingSection() {
  const { framework } = useFramework();

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Licensing</h1>
        <FrameworkSwitcher compact />
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        The plugin uses a perpetual license model with offline RSA-2048 validation. During evaluation you get 30-minute trial sessions — no credit card required.
      </p>

      {/* Trial Mode */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Trial Mode</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Without a license key the plugin runs in trial mode automatically:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li><strong>30-minute sessions</strong> — tracking stops automatically and fires an <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onTrialExpired</code> event.</li>
          <li><strong>1-hour cooldown</strong> — you must wait before starting a new trial session.</li>
          <li><strong>Debug forced on</strong> — verbose logs are enabled so you can inspect behavior.</li>
          <li><strong>Full feature access</strong> — HTTP posting, geofencing, adaptive filter — everything works.</li>
        </ul>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_TRIAL_EXPIRED : REACT_NATIVE_TRIAL_EXPIRED}
        </pre>
      </div>

      {/* Adding a License Key */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Adding a License Key</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {framework === "capacitor"
            ? "Place the license key in your Capacitor config and re-run sync."
            : "Expo users configure via the plugin array. Bare React Native projects set the key in native config files."}
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_LICENSE_SNIPPET : EXPO_LICENSE_SNIPPET}
        </pre>
        {framework === "react-native" && (
          <>
            <p className="mt-4 text-sm font-medium">Bare React Native (no Expo):</p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{BARE_RN_LICENSE_SNIPPET}</pre>
          </>
        )}
      </div>

      {/* How Validation Works */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">How Validation Works</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>RSA-2048 signed payloads verified <strong>fully offline</strong> on-device.</li>
          <li>No network calls, no license server — your app works in airplane mode.</li>
          <li>License bound to your app&apos;s bundle identifier (e.g. <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">com.yourcompany.app</code>).</li>
          <li>Works across both Capacitor and React Native wrappers for the same bundle ID.</li>
        </ul>
      </div>

      {/* Perpetual Model */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Perpetual License Model</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">What You Get</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Perpetual right to use the purchased version</li>
              <li>1 year of updates included</li>
              <li>All features, all platforms</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">After Year One</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Keep using your current version forever</li>
              <li>Optionally renew for another year of updates</li>
              <li>No forced upgrades, no tracking cutoff</li>
            </ul>
          </div>
        </div>
      </div>

      {/* License Status */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Checking License Status</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">configure()</code> result includes license information:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_RESULT : REACT_NATIVE_RESULT}
        </pre>
      </div>

      {/* ConfigureResult */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">ConfigureResult Interface</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Property</th>
                <th className="pb-3 pr-4 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">licenseMode</code></td>
                <td className="py-3 pr-4 text-muted-foreground"><code className="font-mono text-xs">&apos;full&apos; | &apos;trial&apos;</code></td>
                <td className="py-3 text-muted-foreground">Current license mode.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">licenseUpdatesUntil</code></td>
                <td className="py-3 pr-4 text-muted-foreground"><code className="font-mono text-xs">string?</code></td>
                <td className="py-3 text-muted-foreground">ISO date until updates are available.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">licenseUpdateExpired</code></td>
                <td className="py-3 pr-4 text-muted-foreground"><code className="font-mono text-xs">boolean?</code></td>
                <td className="py-3 text-muted-foreground">True if plugin version exceeds update window.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">licenseError</code></td>
                <td className="py-3 pr-4 text-muted-foreground"><code className="font-mono text-xs">string?</code></td>
                <td className="py-3 text-muted-foreground">Validation error message (bundle mismatch, corrupted key, etc.).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
