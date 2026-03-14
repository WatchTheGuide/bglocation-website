export function PlatformGuides() {
  return (
    <section id="platform-guides" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Platform Guides
      </h2>
      <p className="mt-2 text-muted-foreground">
        Platform-specific setup for iOS and Android. The plugin handles most
        configuration automatically via{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          npx cap sync
        </code>
        , but some native settings require manual steps.
      </p>

      {/* iOS */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">iOS</h3>

        <div className="mt-4 space-y-6">
          <div>
            <h4 className="font-semibold">Info.plist — Required Keys</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Add these usage description keys to your app&apos;s{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                Info.plist
              </code>
              . Apple rejects apps without them.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to track your route.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Background location is needed for continuous tracking.</string>`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold">Background Modes</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Enable <strong>Location updates</strong> in Xcode → Signing &
              Capabilities → Background Modes. This adds to your entitlements:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`<key>UIBackgroundModes</key>
<array>
  <string>location</string>
</array>`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold">SLC Fallback</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              The plugin automatically registers for Significant Location Change
              (SLC) monitoring. If iOS kills the app in background, SLC will
              relaunch it and resume standard GPS tracking — no action needed on
              your part.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Minimum Deployment Target</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              iOS 15.0+ (required by Capacitor 8).
            </p>
          </div>
        </div>
      </div>

      {/* Android */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold">Android</h3>

        <div className="mt-4 space-y-6">
          <div>
            <h4 className="font-semibold">Permissions</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              The plugin declares all required permissions in its own{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                AndroidManifest.xml
              </code>
              . They merge automatically via manifest merger — no manual edits
              needed:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`ACCESS_FINE_LOCATION
ACCESS_COARSE_LOCATION
ACCESS_BACKGROUND_LOCATION    <!-- Android 10+ -->
FOREGROUND_SERVICE
FOREGROUND_SERVICE_LOCATION
POST_NOTIFICATIONS            <!-- Android 13+ -->`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold">Foreground Service</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              The plugin runs tracking as a Foreground Service with a persistent
              notification. This prevents Android from killing the process. In
              debug mode, the notification shows live coordinates and counters.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Battery Optimization</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Many OEMs (Samsung, Xiaomi, Huawei, OnePlus) add aggressive
              battery killing beyond stock Android. The plugin detects this and
              emits{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                onBatteryWarning
              </code>{" "}
              with a{" "}
              <a
                href="https://dontkillmyapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                dontkillmyapp.com
              </a>{" "}
              link for the specific device.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Two-Step Permission Flow</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Android 10+ requires requesting foreground location first, then
              background (&quot;Allow all the time&quot;) as a separate step.
              The plugin emits{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                onPermissionRationale
              </code>{" "}
              before the background prompt so you can show a custom UI explaining
              why it&apos;s needed.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`// Step 1: foreground
await BackgroundLocation.requestPermissions({
  permissions: ['location'],
});

// Step 2: background (after foreground granted)
await BackgroundLocation.requestPermissions({
  permissions: ['backgroundLocation'],
});`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold">Minimum SDK</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              minSdk 26 (Android 8.0), compileSdk 36.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
