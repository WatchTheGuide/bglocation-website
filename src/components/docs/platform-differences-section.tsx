type FeatureRow = {
  feature: string;
  ios: string;
  android: string;
  web: string;
};

const METHODS: FeatureRow[] = [
  { feature: "configure()", ios: "✅", android: "✅", web: "✅" },
  { feature: "start()", ios: "✅", android: "✅", web: "✅" },
  { feature: "stop()", ios: "✅", android: "✅", web: "✅" },
  { feature: "getState()", ios: "✅", android: "✅", web: "✅" },
  { feature: "getCurrentPosition()", ios: "✅", android: "✅", web: "✅" },
  { feature: "checkPermissions()", ios: "✅", android: "✅", web: "✅" },
  { feature: "requestPermissions()", ios: "✅", android: "✅", web: "✅" },
  { feature: "getVersion()", ios: "✅", android: "✅", web: "✅" },
  { feature: "addGeofence()", ios: "✅", android: "✅", web: "❌" },
  { feature: "addGeofences()", ios: "✅", android: "✅", web: "❌" },
  { feature: "removeGeofence()", ios: "✅", android: "✅", web: "❌" },
  { feature: "removeAllGeofences()", ios: "✅", android: "✅", web: "❌" },
  { feature: "getGeofences()", ios: "✅", android: "✅", web: "❌" },
  { feature: "checkBatteryOptimization()", ios: "❌", android: "✅", web: "❌" },
  { feature: "requestBatteryOptimization()", ios: "❌", android: "✅", web: "❌" },
];

const EVENTS: FeatureRow[] = [
  { feature: "onLocation", ios: "✅", android: "✅", web: "✅" },
  { feature: "onHeartbeat", ios: "✅", android: "✅", web: "✅" },
  { feature: "onProviderChange", ios: "✅", android: "✅", web: "❌" },
  { feature: "onHttp", ios: "✅", android: "✅", web: "❌" },
  { feature: "onDebug", ios: "✅", android: "✅", web: "❌" },
  { feature: "onBatteryWarning", ios: "❌", android: "✅", web: "❌" },
  { feature: "onAccuracyWarning", ios: "✅", android: "❌", web: "❌" },
  { feature: "onMockLocation", ios: "❌", android: "✅", web: "❌" },
  { feature: "onPermissionRationale", ios: "❌", android: "✅", web: "❌" },
  { feature: "onTrialExpired", ios: "✅", android: "✅", web: "❌" },
  { feature: "onGeofence", ios: "✅", android: "✅", web: "❌" },
];

function FeatureTable({ rows, caption }: { rows: FeatureRow[]; caption: string }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 pr-4 font-semibold">Feature</th>
            <th className="pb-3 pr-4 text-center font-semibold">iOS</th>
            <th className="pb-3 pr-4 text-center font-semibold">Android</th>
            <th className="pb-3 text-center font-semibold">Web</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.feature}>
              <td className="py-3 pr-4"><code className="font-mono text-xs">{row.feature}</code></td>
              <td className="py-3 pr-4 text-center">{row.ios}</td>
              <td className="py-3 pr-4 text-center">{row.android}</td>
              <td className="py-3 text-center">{row.web}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PlatformDifferencesSection() {
  return (
    <div className="mt-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Platform Differences</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The plugin provides a unified API across platforms. Some features are platform-specific by nature — this page maps what&apos;s available where.
      </p>

      {/* Methods */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Methods</h2>
        <FeatureTable rows={METHODS} caption="Method availability by platform" />
      </div>

      {/* Events */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Events</h2>
        <FeatureTable rows={EVENTS} caption="Event availability by platform" />
      </div>

      {/* Behavioral Differences */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Behavioral Differences</h2>
        <div className="mt-4 space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Background Execution</h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">iOS:</span> Uses Background Location Mode, the system may throttle updates when the app is suspended. Significant Location Change (SLC) is used as a fallback to relaunch the app.
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Android:</span> Uses a Foreground Service with a persistent notification. No throttling — as long as the service runs, updates flow continuously.
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Heartbeat Timer</h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">iOS:</span> Uses a background-safe timer. The system may delay callbacks depending on Background App Refresh state.
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Android:</span> Uses <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Handler.postDelayed</code> in the foreground service — precise timing.
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Permissions</h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">iOS:</span> &quot;Always&quot; permission via <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">requestAlwaysAuthorization</code>. Users may grant &quot;While Using&quot; first, then promote later.
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Android:</span> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ACCESS_FINE_LOCATION</code> + <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ACCESS_BACKGROUND_LOCATION</code> must be requested separately. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">POST_NOTIFICATIONS</code> permission required for Android 13+.
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Geofencing</h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">iOS:</span> Uses <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">CLCircularRegion</code>. Monitoring persists across app restarts. System limit: 20 regions per app.
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Android:</span> Uses <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">GeofencingClient</code>. The plugin re-registers geofences after device reboot. Limit: 100 per app, plugin enforces 20.
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Web (Development Fallback)</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The web implementation uses <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">navigator.geolocation.watchPosition</code>. It supports basic location tracking and heartbeats for development and testing. Geofencing, HTTP posting, and native services are not available on the web platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
