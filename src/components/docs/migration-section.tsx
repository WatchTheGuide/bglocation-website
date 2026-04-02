type MappingRow = {
  old: string;
  new: string;
  notes: string;
};

const API_MAPPING: MappingRow[] = [
  { old: "BackgroundGeolocation.configure()", new: "BackgroundLocation.configure()", notes: "Options restructured — see config changes below" },
  { old: "BackgroundGeolocation.start()", new: "BackgroundLocation.start()", notes: "Same behavior" },
  { old: "BackgroundGeolocation.stop()", new: "BackgroundLocation.stop()", notes: "Same behavior" },
  { old: "BackgroundGeolocation.getCurrentLocation()", new: "BackgroundLocation.getCurrentPosition()", notes: "Renamed method" },
  { old: "BackgroundGeolocation.checkStatus()", new: "BackgroundLocation.getState()", notes: "Returns LocationState instead of status object" },
  { old: "addWatcher()", new: "addListener('onLocation', …)", notes: "Event-based instead of watcher pattern" },
  { old: "N/A", new: "addGeofence() / addGeofences()", notes: "New geofencing support" },
  { old: "N/A", new: "getVersion()", notes: "New version info" },
  { old: "N/A", new: "checkBatteryOptimization()", notes: "New Android battery check" },
];

const CONFIG_CHANGES: { old: string; new: string; notes: string }[] = [
  { old: "interval / minInterval", new: "locationUpdateInterval", notes: "Unified interval name (Android)" },
  { old: "distanceFilter", new: "distanceFilter", notes: 'Same, but now supports "auto" mode' },
  { old: "stationaryRadius", new: "N/A", notes: "Removed — use adaptive filter instead" },
  { old: "debug", new: "debug / debugSounds", notes: "Split into separate flags" },
  { old: "stopAfterTerminate", new: "N/A", notes: "Plugin always runs via native service" },
  { old: "startOnBoot", new: "N/A", notes: "Not supported — re-start manually" },
  { old: "N/A", new: "http: { url, headers, buffer }", notes: "New native HTTP posting" },
  { old: "N/A", new: "autoDistanceFilter: { … }", notes: "New adaptive filter config" },
  { old: "N/A", new: "heartbeatInterval", notes: "New heartbeat timer" },
];

export function MigrationSection() {
  return (
    <div className="mt-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Migration Guide</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Migrating from <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">@capacitor-community/background-geolocation</code> or similar plugins to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">@bglocation/capacitor</code>.
      </p>

      {/* Step-by-step */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Migration Steps</h2>
        <ol className="mt-4 list-inside list-decimal space-y-4 text-sm">
          <li>
            <span className="font-medium">Uninstall the old plugin</span>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-sm">npm uninstall @capacitor-community/background-geolocation</pre>
          </li>
          <li>
            <span className="font-medium">Install @bglocation/capacitor</span>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-sm">npm install @bglocation/capacitor{"\n"}npx cap sync</pre>
          </li>
          <li>
            <span className="font-medium">Update imports</span>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-sm">{`// Before
import { BackgroundGeolocation } from '@capacitor-community/background-geolocation';

// After
import { BackgroundLocation } from '@bglocation/capacitor';`}</pre>
          </li>
          <li>
            <span className="font-medium">Update configuration</span>
            <p className="mt-1 text-muted-foreground">Restructure your config options — see the mapping table below.</p>
          </li>
          <li>
            <span className="font-medium">Replace watchers with event listeners</span>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-sm">{`// Before
const watcherId = await BackgroundGeolocation.addWatcher(options, callback);

// After
BackgroundLocation.addListener('onLocation', (location) => { ... });
BackgroundLocation.addListener('onHeartbeat', (event) => { ... });`}</pre>
          </li>
          <li>
            <span className="font-medium">Sync native projects</span>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-sm">npx cap sync</pre>
          </li>
          <li>
            <span className="font-medium">Test on a physical device</span>
            <p className="mt-1 text-muted-foreground">Background location must always be validated on real hardware.</p>
          </li>
        </ol>
      </div>

      {/* API Mapping */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">API Mapping</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Old API</th>
                <th className="pb-3 pr-4 font-semibold">New API</th>
                <th className="pb-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {API_MAPPING.map((row) => (
                <tr key={row.old + row.new}>
                  <td className="py-3 pr-4"><code className="font-mono text-xs">{row.old}</code></td>
                  <td className="py-3 pr-4"><code className="font-mono text-xs">{row.new}</code></td>
                  <td className="py-3 text-muted-foreground">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Config Changes */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Configuration Changes</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Old Option</th>
                <th className="pb-3 pr-4 font-semibold">New Option</th>
                <th className="pb-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {CONFIG_CHANGES.map((row) => (
                <tr key={row.old + row.new}>
                  <td className="py-3 pr-4"><code className="font-mono text-xs">{row.old}</code></td>
                  <td className="py-3 pr-4"><code className="font-mono text-xs">{row.new}</code></td>
                  <td className="py-3 text-muted-foreground">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* What's New */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">What You Gain</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">Native HTTP Posting</p>
            <p className="mt-1 text-xs text-muted-foreground">Automatic POST with offline buffer and retry — no JS bridge needed.</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">Geofencing</p>
            <p className="mt-1 text-xs text-muted-foreground">Up to 20 circular regions with enter, exit, and dwell transitions.</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">Adaptive Distance Filter</p>
            <p className="mt-1 text-xs text-muted-foreground">Speed-based auto mode adjusts filter dynamically for optimal battery/accuracy.</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">Heartbeat Timer</p>
            <p className="mt-1 text-xs text-muted-foreground">Periodic callbacks even when stationary — know the device is alive.</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">React Native Support</p>
            <p className="mt-1 text-xs text-muted-foreground">Same native core powers both Capacitor and React Native wrappers.</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">Debug Mode</p>
            <p className="mt-1 text-xs text-muted-foreground">Verbose logs, system sounds, and JS debug events for faster diagnosis.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
