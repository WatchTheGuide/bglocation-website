export function GettingStarted() {
  return (
    <section id="getting-started" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Getting Started
      </h2>
      <p className="mt-2 text-muted-foreground">
        Install the plugin, configure tracking, and get your first location
        update in under 5 minutes.
      </p>

      <div className="mt-8 space-y-8">
        {/* Step 1 */}
        <div>
          <h3 className="text-lg font-semibold">1. Install</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`npm install capacitor-bglocation
npx cap sync`}
          </pre>
        </div>

        {/* Step 2 */}
        <div>
          <h3 className="text-lg font-semibold">2. Configure & Start</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`import { BackgroundLocation } from 'capacitor-bglocation';

// Configure the plugin (must be called before start)
await BackgroundLocation.configure({
  distanceFilter: 15,           // meters between updates
  desiredAccuracy: 'high',      // 'high' | 'balanced' | 'low'
  heartbeatInterval: 15,        // seconds
  locationUpdateInterval: 5000, // ms (Android only)
  debug: true,                  // verbose logging
});

// Listen for location updates
BackgroundLocation.addListener('onLocation', (location) => {
  console.log(location.latitude, location.longitude);
});

// Start tracking
await BackgroundLocation.start();`}
          </pre>
        </div>

        {/* Step 3 */}
        <div>
          <h3 className="text-lg font-semibold">3. Stop Tracking</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`await BackgroundLocation.stop();
await BackgroundLocation.removeAllListeners();`}
          </pre>
        </div>

        {/* Permissions Note */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium">Permissions</p>
          <p className="mt-1 text-sm text-muted-foreground">
            On Android 10+, request foreground permission first, then
            background. On iOS, call{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              requestPermissions()
            </code>{" "}
            — the system handles the Always/When In Use flow. See{" "}
            <a href="#platform-guides" className="font-medium text-primary underline underline-offset-4">
              Platform Guides
            </a>{" "}
            for details.
          </p>
        </div>
      </div>
    </section>
  );
}
