"use client";

import { useFramework } from "@/components/framework/framework-provider";

const IOS_KEYS = `<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to track your route.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Background location is needed for continuous tracking.</string>`;

const IOS_BACKGROUND_MODES = `<key>UIBackgroundModes</key>
<array>
  <string>location</string>
</array>`;

const EXPO_PLUGIN_SNIPPET = `{
  "expo": {
    "plugins": [
      [
        "react-native-bglocation",
        {
          "licenseKey": "BGL1-eyJ...",
          "locationWhenInUsePermission": "We use your location to track your route.",
          "locationAlwaysPermission": "We use your location in the background for continuous tracking."
        }
      ]
    ]
  }
}`;

const ANDROID_PERMISSIONS = `ACCESS_FINE_LOCATION
ACCESS_COARSE_LOCATION
ACCESS_BACKGROUND_LOCATION
FOREGROUND_SERVICE
FOREGROUND_SERVICE_LOCATION
POST_NOTIFICATIONS`;

const CAPACITOR_PERMISSION_FLOW = `await BackgroundLocation.requestPermissions({
  permissions: ['location'],
});

await BackgroundLocation.requestPermissions({
  permissions: ['backgroundLocation'],
});`;

const REACT_NATIVE_PERMISSION_FLOW = `await requestPermissions({
  permissions: ['location'],
});

await requestPermissions({
  permissions: ['backgroundLocation'],
});`;

export function PlatformGuides() {
  const { framework } = useFramework();

  return (
    <section id="platform-guides" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Platform Guides</h2>
      <p className="mt-2 text-muted-foreground">
        Platform-specific setup for iOS and Android. The native core is the same, but the wrapper decides how much gets automated for you.
      </p>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">iOS</h3>
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="font-semibold">Info.plist — Required Keys</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {framework === "capacitor"
                ? "Capacitor apps still need the usual location usage descriptions in the host app's Info.plist."
                : "Expo projects can generate these values through the config plugin. Bare React Native apps should add them directly in Info.plist."}
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{IOS_KEYS}</pre>
          </div>

          <div>
            <h4 className="font-semibold">Background Modes</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Enable <strong>Location updates</strong> in Xcode. Expo users get this automatically after
              <span className="font-mono"> expo prebuild</span> when the config plugin is configured.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{IOS_BACKGROUND_MODES}</pre>
          </div>

          {framework === "react-native" && (
            <div>
              <h4 className="font-semibold">Expo Config Plugin</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                The React Native package ships with an Expo config plugin that injects permissions, background modes, and the license key during prebuild.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{EXPO_PLUGIN_SNIPPET}</pre>
            </div>
          )}

          <div>
            <h4 className="font-semibold">SLC Fallback</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Significant Location Change monitoring is registered automatically. If iOS kills the app, the native core uses SLC to relaunch and resume standard GPS tracking.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Minimum Deployment Target</h4>
            <p className="mt-1 text-sm text-muted-foreground">iOS 15.0+.</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold">Android</h3>
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="font-semibold">Permissions</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {framework === "capacitor"
                ? "The Capacitor plugin contributes its manifest entries automatically during sync and manifest merge."
                : "Expo prebuild or the Android manifest merger will add the required permissions from the React Native package."}
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{ANDROID_PERMISSIONS}</pre>
          </div>

          <div>
            <h4 className="font-semibold">Foreground Service</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Tracking runs inside a foreground service with a persistent notification. This is what keeps Android from killing the process during long sessions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Battery Optimization</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              OEM battery killers are detected automatically. The wrapper emits <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onBatteryWarning</code> with an OEM-specific help URL.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Two-Step Permission Flow</h4>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
              {framework === "capacitor" ? CAPACITOR_PERMISSION_FLOW : REACT_NATIVE_PERMISSION_FLOW}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold">Minimum SDK</h4>
            <p className="mt-1 text-sm text-muted-foreground">minSdk 26 (Android 8.0), compileSdk 36.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
