"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";

const IOS_PLIST_KEYS = `<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to track your route.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Background location is needed for continuous tracking.</string>`;

const IOS_BACKGROUND_MODES = `<key>UIBackgroundModes</key>
<array>
  <string>location</string>
</array>`;

const EXPO_CONFIG = `{
  "expo": {
    "plugins": [
      [
        "@bglocation/react-native",
        {
          "licenseKey": "BGL1-eyJ...",
          "locationWhenInUsePermission": "We use your location to track your route.",
          "locationAlwaysPermission": "Background location for continuous tracking."
        }
      ]
    ]
  }
}`;

const ANDROID_PERMISSIONS = `ACCESS_FINE_LOCATION                 <!-- GPS -->
ACCESS_COARSE_LOCATION               <!-- Wi-Fi / Cell -->
ACCESS_BACKGROUND_LOCATION           <!-- Android 10+ -->
FOREGROUND_SERVICE                   <!-- Required for foreground service -->
FOREGROUND_SERVICE_LOCATION          <!-- Android 14+ -->
POST_NOTIFICATIONS                   <!-- Android 13+ notification -->`;

const CAPACITOR_FLOW = `import { BackgroundLocation } from '@bglocation/capacitor';

// Step 1: Check current state
const status = await BackgroundLocation.checkPermissions();
console.log('Foreground:', status.location);        // 'granted' | 'denied' | 'prompt'
console.log('Background:', status.backgroundLocation);

// Step 2: Request foreground first
if (status.location !== 'granted') {
  await BackgroundLocation.requestPermissions({ permissions: ['location'] });
}

// Step 3: Request background (Android: must be separate step)
if (status.backgroundLocation !== 'granted') {
  await BackgroundLocation.requestPermissions({ permissions: ['backgroundLocation'] });
}

// Step 4: Handle rationale (Android 11+)
BackgroundLocation.addListener('onPermissionRationale', (event) => {
  // Show custom UI explaining why "Allow all the time" is needed
  console.log(event.message);
  console.log('Should show rationale:', event.shouldShowRationale);
});`;

const REACT_NATIVE_FLOW = `import {
  addListener,
  checkPermissions,
  requestPermissions,
} from '@bglocation/react-native';

// Step 1: Check current state
const status = await checkPermissions();
console.log('Foreground:', status.location);
console.log('Background:', status.backgroundLocation);

// Step 2: Request foreground first
if (status.location !== 'granted') {
  await requestPermissions({ permissions: ['location'] });
}

// Step 3: Request background (Android: must be separate step)
if (status.backgroundLocation !== 'granted') {
  await requestPermissions({ permissions: ['backgroundLocation'] });
}

// Step 4: Handle rationale (Android 11+)
addListener('onPermissionRationale', (event) => {
  // Show custom UI explaining why "Allow all the time" is needed
  console.log(event.message);
  console.log('Should show rationale:', event.shouldShowRationale);
});`;

const CAPACITOR_BATTERY = `// Check battery optimization state
const batteryState = await BackgroundLocation.checkBatteryOptimization();
console.log('Ignoring optimizations:', batteryState.isIgnoringOptimizations);
console.log('Manufacturer:', batteryState.manufacturer);
console.log('Help URL:', batteryState.helpUrl);

// Open system battery settings
await BackgroundLocation.requestBatteryOptimization();

// Listen for automatic warnings on start()
BackgroundLocation.addListener('onBatteryWarning', (event) => {
  console.warn(event.message);
  // Open dontkillmyapp.com with OEM-specific instructions
  window.open(event.helpUrl);
});`;

const REACT_NATIVE_BATTERY = `import {
  addListener,
  checkBatteryOptimization,
  requestBatteryOptimization,
} from '@bglocation/react-native';

// Check battery optimization state
const batteryState = await checkBatteryOptimization();
console.log('Ignoring optimizations:', batteryState.isIgnoringOptimizations);

// Open system battery settings
await requestBatteryOptimization();

// Listen for automatic warnings on start()
addListener('onBatteryWarning', (event) => {
  console.warn(event.message);
});`;

export function PermissionsSection() {
  const { framework } = useFramework();

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Permissions & Setup</h1>
        <FrameworkSwitcher compact />
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        Detailed platform setup for iOS and Android — permissions, background modes, Expo config plugin, and store review tips.
      </p>

      {/* iOS */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold">iOS</h2>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Info.plist Keys</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {framework === "capacitor"
              ? "Add these keys to your Xcode project's Info.plist. Capacitor apps managed with Xcode should add them directly."
              : "Expo projects: the config plugin injects these automatically from app.json. Bare RN apps need to add them manually."}
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{IOS_PLIST_KEYS}</pre>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold">Background Modes</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Enable <strong>Location updates</strong> in Xcode &gt; Signing & Capabilities &gt; Background Modes, or add to Info.plist:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{IOS_BACKGROUND_MODES}</pre>
        </div>

        {framework === "react-native" && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold">Expo Config Plugin</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The React Native package ships with an Expo config plugin that injects permissions, background modes, and the license key during prebuild.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{EXPO_CONFIG}</pre>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold">iOS Specifics</h3>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li><strong>Minimum target:</strong> iOS 15.0+</li>
            <li><strong>SLC fallback:</strong> Significant Location Change monitoring is registered automatically. If iOS kills the app, SLC relaunches it and standard GPS tracking resumes.</li>
            <li><strong>Approximate location (iOS 14+):</strong> If the user grants only approximate location, the plugin emits <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onAccuracyWarning</code> on start.</li>
          </ul>
        </div>
      </div>

      {/* Android */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold">Android</h2>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Manifest Permissions</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {framework === "capacitor"
              ? "The Capacitor plugin contributes its manifest entries automatically during sync and manifest merge."
              : "Expo prebuild and the Android manifest merger add the required permissions from the React Native package."}
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{ANDROID_PERMISSIONS}</pre>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold">Foreground Service</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tracking runs as a foreground service with a persistent notification. This prevents Android from killing the process. Customize the notification text via <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">notification.title</code> and <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">notification.text</code> in the config.
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold">Minimum SDK</h3>
          <p className="mt-2 text-sm text-muted-foreground">minSdk 26 (Android 8.0), compileSdk 36.</p>
        </div>
      </div>

      {/* Permission Flow */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold">Runtime Permission Flow</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          On Android 10+, background location must be requested as a separate step after foreground permission is granted. The plugin provides a two-step flow:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed">
          {framework === "capacitor" ? CAPACITOR_FLOW : REACT_NATIVE_FLOW}
        </pre>
      </div>

      {/* Battery Optimization */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold">Battery Optimization (Android)</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Android OEM battery killers (Xiaomi, Huawei, Samsung, etc.) can stop background tracking. The plugin detects this automatically and emits <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onBatteryWarning</code> with an OEM-specific help URL from <a href="https://dontkillmyapp.com" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">dontkillmyapp.com</a>.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed">
          {framework === "capacitor" ? CAPACITOR_BATTERY : REACT_NATIVE_BATTERY}
        </pre>
      </div>

      {/* Store Guidelines */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold">App Store & Play Store Guidelines</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Apple App Store</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Provide clear, user-visible purpose strings in Info.plist</li>
              <li>Explain background location use in App Review notes</li>
              <li>Show the blue bar indicator when tracking (automatic)</li>
              <li>Only request &quot;Always&quot; if your app genuinely requires background tracking</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Google Play Store</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Declare <code className="font-mono text-xs">ACCESS_BACKGROUND_LOCATION</code> with a clear rationale</li>
              <li>Complete the location permission declaration form in Play Console</li>
              <li>Show an in-app disclosure before requesting background permission</li>
              <li>Use foreground service notification (plugin handles this automatically)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
