"use client";

import { useFramework } from "@/components/framework/framework-provider";

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

const EXPO_LICENSE_SNIPPET = `{
  "expo": {
    "plugins": [
      [
        "react-native-bglocation",
        {
          "licenseKey": "BGL1-eyJ..."
        }
      ]
    ]
  }
}`;

const BARE_RN_LICENSE_SNIPPET = `<!-- iOS Info.plist -->
<key>BGLocationLicenseKey</key>
<string>BGL1-eyJ...</string>

<!-- AndroidManifest.xml -->
<meta-data
  android:name="dev.bglocation.LICENSE_KEY"
  android:value="BGL1-eyJ..." />`;

const CAPACITOR_RESULT = `const result = await BackgroundLocation.configure({ ... });

// result.licenseMode: 'full' | 'trial'
// result.licenseUpdatesUntil?: string
// result.licenseUpdateExpired?: boolean
// result.licenseError?: string`;

const REACT_NATIVE_RESULT = `const result = await configure({ ... });

// result.licenseMode: 'full' | 'trial'
// result.licenseUpdatesUntil?: string
// result.licenseUpdateExpired?: boolean
// result.licenseError?: string`;

export function Licensing() {
  const { framework } = useFramework();

  return (
    <section id="licensing" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Licensing</h2>
      <p className="mt-2 text-muted-foreground">
        Trial mode, offline validation, bundle ID binding, and where to place your license key.
      </p>

      <div className="mt-8">
        <h3 className="text-lg font-semibold">Trial Mode</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>30-minute sessions with automatic stop and an <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onTrialExpired</code> event.</li>
          <li>1-hour cooldown between trial sessions.</li>
          <li>Debug mode is forced on so you can inspect behavior before buying.</li>
        </ul>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">Adding a License Key</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {framework === "capacitor"
            ? "Place the key in capacitor.config.ts and rerun sync."
            : "Expo users should configure the package plugin. Bare React Native apps can set the same value directly in native config."}
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_LICENSE_SNIPPET : EXPO_LICENSE_SNIPPET}
        </pre>
        {framework === "react-native" && (
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{BARE_RN_LICENSE_SNIPPET}</pre>
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">How Validation Works</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>RSA-2048 signed payloads are verified fully offline on-device.</li>
          <li>The license is bound to a bundle ID and can be used across the Capacitor and React Native wrappers for the same app identifier.</li>
          <li>The license itself is perpetual. One year of updates is included, then update access can be renewed.</li>
        </ul>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">License Status</h3>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_RESULT : REACT_NATIVE_RESULT}
        </pre>
      </div>
    </section>
  );
}
