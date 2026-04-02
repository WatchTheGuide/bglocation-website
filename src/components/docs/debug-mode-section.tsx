"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";

const CAPACITOR_DEBUG = `import { BackgroundLocation } from '@bglocation/capacitor';

await BackgroundLocation.configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  debug: true,         // enable verbose logs
  debugSounds: true,   // play system sounds on events (iOS)
});

// Listen for debug messages
BackgroundLocation.addListener('onDebug', (event) => {
  console.log(\`[DEBUG \${new Date(event.timestamp).toISOString()}] \${event.message}\`);
});

await BackgroundLocation.start();`;

const REACT_NATIVE_DEBUG = `import { addListener, configure, start } from '@bglocation/react-native';

await configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  debug: true,         // enable verbose logs
  debugSounds: true,   // play system sounds on events (iOS)
});

// Listen for debug messages
addListener('onDebug', (event) => {
  console.log(\`[DEBUG \${new Date(event.timestamp).toISOString()}] \${event.message}\`);
});

await start();`;

const DEBUG_EVENT_INTERFACE = `interface DebugEvent {
  message: string;     // debug log message
  timestamp: number;   // epoch milliseconds
}`;

export function DebugModeSection() {
  const { framework } = useFramework();

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Debug Mode</h1>
        <FrameworkSwitcher compact />
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        Enable debug mode during development to see verbose native logs, hear system sounds on key events, and receive <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onDebug</code> events in JavaScript.
      </p>

      {/* Enable Debug */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Enable Debug Mode</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Set <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">debug: true</code> in your configuration. Optionally enable <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">debugSounds: true</code> for audio feedback.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed">
          {framework === "capacitor" ? CAPACITOR_DEBUG : REACT_NATIVE_DEBUG}
        </pre>
      </div>

      {/* What Debug Mode Does */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">What Debug Mode Does</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Feature</th>
                <th className="pb-3 pr-4 font-semibold">iOS</th>
                <th className="pb-3 font-semibold">Android</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3 pr-4 font-medium">Verbose native logs</td>
                <td className="py-3 pr-4 text-muted-foreground">os_log (visible in Console.app)</td>
                <td className="py-3 text-muted-foreground">Logcat (filter: BGLocation)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">onDebug events to JS</td>
                <td className="py-3 pr-4 text-muted-foreground">Yes</td>
                <td className="py-3 text-muted-foreground">Yes</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">System sounds</td>
                <td className="py-3 pr-4 text-muted-foreground">When debugSounds: true</td>
                <td className="py-3 text-muted-foreground">When debugSounds: true</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Dynamic notification</td>
                <td className="py-3 pr-4 text-muted-foreground">N/A (blue pill indicator)</td>
                <td className="py-3 text-muted-foreground">Coordinates, counters, status in notification</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* DebugEvent */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">DebugEvent Interface</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{DEBUG_EVENT_INTERFACE}</pre>
      </div>

      {/* Physical Device vs Simulator */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Physical Device vs Simulator</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold text-green-600 dark:text-green-400">Physical Device</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Real GPS hardware — actual coordinates and speed</li>
              <li>Background execution behaves as in production</li>
              <li>Battery optimization and Foreground Service work normally</li>
              <li>Required for production-level testing</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold text-orange-600 dark:text-orange-400">Simulator / Emulator</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>iOS Simulator: use Debug &gt; Location &gt; Custom Location or GPX files</li>
              <li>Android Emulator: use extended controls &gt; Location</li>
              <li>Background behavior may differ from real devices</li>
              <li>Useful for API flow testing, not for GPS accuracy testing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trial Mode Note */}
      <div className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium">Trial Mode Forces Debug</p>
        <p className="mt-1 text-sm text-muted-foreground">
          In trial mode (no license key), <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">debug</code> is forced to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">true</code> automatically so you can inspect plugin behavior while evaluating.
        </p>
      </div>

      {/* Disable Before Release */}
      <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">Disable Before Release</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Always set <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">debug: false</code> (or omit it) in production builds. Debug mode increases battery consumption, generates excessive logs, and may expose internal information in the notification.
        </p>
      </div>
    </div>
  );
}
