"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";

type FaqItem = {
  question: string;
  answer: string;
  platforms: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "GPS not updating in the background (iOS)",
    answer:
      'Ensure the "Location updates" background mode is enabled in Xcode (Signing & Capabilities). Verify Info.plist contains NSLocationAlwaysAndWhenInUseUsageDescription. Check that the user granted "Always" permission — "While Using" is not sufficient for background updates.',
    platforms: "iOS",
  },
  {
    question: "GPS not updating in the background (Android)",
    answer:
      "The plugin uses a Foreground Service with a persistent notification. Ensure POST_NOTIFICATIONS permission is granted on Android 13+. Some OEMs (Xiaomi, Huawei, Samsung) aggressively kill background services — see the battery optimization section below.",
    platforms: "Android",
  },
  {
    question: "OEM battery optimization kills service",
    answer:
      'Many Android OEMs add proprietary battery optimization that kills foreground services. Use checkBatteryOptimization() and requestBatteryOptimization() to detect and prompt users. Listen for onBatteryWarning events. Direct users to Settings > Apps > [Your App] > Battery > Unrestricted. See dontkillmyapp.com for device-specific instructions.',
    platforms: "Android",
  },
  {
    question: "iOS shows approximate location only",
    answer:
      "iOS 14+ allows users to grant only approximate (±5km) location. The plugin detects this and fires onAccuracyWarning. Guide users: Settings > Privacy > Location Services > [Your App] > Precise Location: ON.",
    platforms: "iOS",
  },
  {
    question: "Foreground notification won't go away",
    answer:
      "On Android, the notification is required by the OS for foreground services. It disappears automatically when you call stop(). If it persists after an app crash, restart the app and call stop() or clear the app from recent tasks.",
    platforms: "Android",
  },
  {
    question: "Trial session won't start (cooldown active)",
    answer:
      "After a 30-minute trial session ends, there's a 1-hour cooldown before the next one. The plugin throws TRIAL_COOLDOWN if you call start() during this period. Wait for the cooldown to expire or add a license key.",
    platforms: "iOS, Android",
  },
  {
    question: "HTTP POST requests failing",
    answer:
      "Check onHttp event for statusCode and error details. Verify the URL is reachable from a device (not just localhost). Ensure your server accepts the POST body format (JSON with location/coords keys). Failed requests are buffered automatically and retried on next location update.",
    platforms: "iOS, Android",
  },
  {
    question: "Geofence events not triggering",
    answer:
      "Geofencing depends on the device's geofencing hardware (Wi-Fi, cell towers, GPS). Small radius (<100m) may not trigger reliably on all devices. Ensure configure() was called before addGeofence(). Check that notifyOnEntry/notifyOnExit is set to true. On Android, background location permission is required.",
    platforms: "iOS, Android",
  },
  {
    question: "Location accuracy is poor",
    answer:
      'Use desiredAccuracy: "high" for GPS-level accuracy. Test on a physical device — simulators use fake locations. Ensure the device has a clear sky view for GPS signal. Indoor testing typically shows lower accuracy.',
    platforms: "iOS, Android",
  },
  {
    question: "Plugin works in dev but not in production build",
    answer:
      "Verify the license key is included in the production config. Check that bundle ID in the license matches the built app. Run configure() and check the ConfigureResult for licenseError. Ensure native build includes all required permissions and entitlements.",
    platforms: "iOS, Android",
  },
];

export function TroubleshootingSection() {
  const { framework } = useFramework();

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Troubleshooting</h1>
        <FrameworkSwitcher compact />
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        Common issues and their solutions. Most problems are related to permissions, battery optimization, or platform-specific behavior.
      </p>

      {/* FAQ */}
      <div className="mt-10 space-y-6">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{item.question}</h2>
              <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {item.platforms}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* Battery Optimization */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Battery Optimization Detection</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use the plugin API to detect and prompt users about battery optimization:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor"
            ? `// Check battery optimization state
const status = await BackgroundLocation.checkBatteryOptimization();

if (status.isIgnoringOptimizations === false) {
  // Show explanation, then open settings
  await BackgroundLocation.requestBatteryOptimization();
}

// Listen for ongoing warnings
BackgroundLocation.addListener('onBatteryWarning', (event) => {
  console.warn('Battery optimization active:', event.message);
});`
            : `// Check battery optimization state
const status = await checkBatteryOptimization();

if (status.isIgnoringOptimizations === false) {
  // Show explanation, then open settings
  await requestBatteryOptimization();
}

// Listen for ongoing warnings
addListener('onBatteryWarning', (event) => {
  console.warn('Battery optimization active:', event.message);
});`}
        </pre>
      </div>

      {/* Debug Mode */}
      <div className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium">Use Debug Mode for Diagnosis</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Set <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">debug: true</code> in your configure options to get verbose native logs and JavaScript <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onDebug</code> events. This is the fastest way to diagnose tracking issues. See the Debug Mode page for details.
        </p>
      </div>
    </div>
  );
}
