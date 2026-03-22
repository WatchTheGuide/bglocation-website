export function ApiReference() {
  return (
    <section id="api-reference" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        API Reference
      </h2>
      <p className="mt-2 text-muted-foreground">
        Complete TypeScript API — methods, events, and interfaces exported
        from{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          capacitor-bglocation
        </code>
        .
      </p>

      {/* Methods Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Methods</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Method</th>
                <th className="pb-3 pr-4 font-semibold">Returns</th>
                <th className="pb-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {METHODS.map((m) => (
                <tr key={m.name}>
                  <td className="py-3 pr-4">
                    <code className="font-mono text-xs">{m.name}</code>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    <code className="font-mono text-xs">{m.returns}</code>
                  </td>
                  <td className="py-3 text-muted-foreground">{m.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Events Table */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">Events</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Register listeners via{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            BackgroundLocation.addListener(event, handler)
          </code>
          .
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Event</th>
                <th className="pb-3 pr-4 font-semibold">Payload</th>
                <th className="pb-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {EVENTS.map((e) => (
                <tr key={e.name}>
                  <td className="py-3 pr-4">
                    <code className="font-mono text-xs">{e.name}</code>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    <code className="font-mono text-xs">{e.payload}</code>
                  </td>
                  <td className="py-3 text-muted-foreground">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Location Interface */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">Location Object</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Returned by{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            onLocation
          </code>
          ,{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            getCurrentPosition()
          </code>
          , and inside{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            HeartbeatEvent
          </code>
          .
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;      // meters
  speed: number;         // m/s (≥ 0)
  heading: number;       // degrees 0-360, -1 if unavailable
  altitude: number;      // meters above sea level
  timestamp: number;     // ms since epoch
  isMoving: boolean;     // true when speed > 0.5 m/s
  isMock: boolean;       // Android only, always false on iOS/Web
  effectiveDistanceFilter?: number; // only in 'auto' mode
}`}
        </pre>
      </div>

      {/* Geofencing */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">Geofencing</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor circular regions for enter, exit, and dwell transitions. Up
          to 20 geofences can be active simultaneously.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Method</th>
                <th className="pb-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3 pr-4">
                  <code className="font-mono text-xs">addGeofence(geofence)</code>
                </td>
                <td className="py-3 text-muted-foreground">
                  Add a single geofence region. Replaces if identifier exists.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <code className="font-mono text-xs">addGeofences(options)</code>
                </td>
                <td className="py-3 text-muted-foreground">
                  Add multiple geofences atomically (all-or-nothing).
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <code className="font-mono text-xs">removeGeofence(options)</code>
                </td>
                <td className="py-3 text-muted-foreground">
                  Remove geofence by identifier. No-op if not found.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <code className="font-mono text-xs">removeAllGeofences()</code>
                </td>
                <td className="py-3 text-muted-foreground">
                  Remove all registered geofences.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <code className="font-mono text-xs">getGeofences()</code>
                </td>
                <td className="py-3 text-muted-foreground">
                  List currently registered geofences.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Listen for transitions via the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            onGeofence
          </code>{" "}
          event. Geofencing is supported on Android — iOS support is coming
          soon. Web rejects with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            UNSUPPORTED
          </code>
          .
        </p>

        <h4 className="mt-6 font-semibold">Geofence Interface</h4>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`interface Geofence {
  identifier: string;          // unique ID, used to remove/replace
  latitude: number;            // center latitude in degrees
  longitude: number;           // center longitude in degrees
  radius: number;              // radius in meters (min ~100m recommended)
  notifyOnEntry?: boolean;     // default: true
  notifyOnExit?: boolean;      // default: true
  notifyOnDwell?: boolean;     // default: false
  dwellDelay?: number;         // seconds before dwell fires (default: 300)
  extras?: Record<string, string>; // attached to events
}`}
        </pre>

        <h4 className="mt-6 font-semibold">GeofenceEvent Interface</h4>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`interface GeofenceEvent {
  identifier: string;              // which geofence triggered
  action: 'enter' | 'exit' | 'dwell';
  location: Location | null;       // location at time of transition
  extras?: Record<string, string>; // extras from geofence definition
  timestamp: number;               // epoch ms
}`}
        </pre>

        <h4 className="mt-6 font-semibold">Error Codes</h4>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Code</th>
                <th className="pb-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">NOT_CONFIGURED</code></td>
                <td className="py-3 text-muted-foreground">configure() not called before adding geofences.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">GEOFENCE_LIMIT_EXCEEDED</code></td>
                <td className="py-3 text-muted-foreground">Max 20 geofences active simultaneously.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">GEOFENCE_ERROR</code></td>
                <td className="py-3 text-muted-foreground">Native geofencing registration failed.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">UNSUPPORTED</code></td>
                <td className="py-3 text-muted-foreground">Web platform — geofencing not available.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const METHODS = [
  {
    name: "checkPermissions()",
    returns: "Promise<LocationPermissionStatus>",
    description: "Check current location permission status.",
  },
  {
    name: "requestPermissions(options?)",
    returns: "Promise<LocationPermissionStatus>",
    description:
      "Request location permissions. On Android 10+, request foreground first, then background.",
  },
  {
    name: "configure(options)",
    returns: "Promise<ConfigureResult>",
    description:
      "Configure tracking parameters. Must be called before start(). Returns license mode.",
  },
  {
    name: "start()",
    returns: "Promise<LocationState>",
    description:
      "Start background location tracking. Requires configure() and permissions.",
  },
  {
    name: "stop()",
    returns: "Promise<LocationState>",
    description: "Stop background location tracking.",
  },
  {
    name: "getState()",
    returns: "Promise<LocationState>",
    description: "Get current plugin state (enabled, tracking).",
  },
  {
    name: "getCurrentPosition(options?)",
    returns: "Promise<Location>",
    description: "Request a single location update.",
  },
  {
    name: "checkBatteryOptimization()",
    returns: "Promise<BatteryWarningEvent>",
    description: "Check if battery optimization affects tracking (Android only).",
  },
  {
    name: "requestBatteryOptimization()",
    returns: "Promise<BatteryWarningEvent>",
    description: "Open battery optimization settings (Android only).",
  },
  {
    name: "removeAllListeners()",
    returns: "Promise<void>",
    description: "Remove all event listeners.",
  },
] as const;

const EVENTS = [
  {
    name: "onLocation",
    payload: "Location",
    description: "Location update based on distanceFilter.",
  },
  {
    name: "onHeartbeat",
    payload: "HeartbeatEvent",
    description: "Periodic heartbeat, even when stationary.",
  },
  {
    name: "onProviderChange",
    payload: "ProviderChangeEvent",
    description: "GPS/network provider status changed.",
  },
  {
    name: "onHttp",
    payload: "HttpEvent",
    description: "Native HTTP POST result (requires http config).",
  },
  {
    name: "onDebug",
    payload: "DebugEvent",
    description: "Debug log message (requires debug: true).",
  },
  {
    name: "onBatteryWarning",
    payload: "BatteryWarningEvent",
    description: "Battery optimization detected (Android only).",
  },
  {
    name: "onAccuracyWarning",
    payload: "AccuracyWarningEvent",
    description: "Approximate location granted (iOS 14+ only).",
  },
  {
    name: "onMockLocation",
    payload: "MockLocationEvent",
    description: "Mock location detected (Android only).",
  },
  {
    name: "onPermissionRationale",
    payload: "PermissionRationaleEvent",
    description: "Show rationale before background permission (Android 11+).",
  },
  {
    name: "onTrialExpired",
    payload: "TrialExpiredEvent",
    description: "Trial session ended — tracking auto-stopped.",
  },
  {
    name: "onGeofence",
    payload: "GeofenceEvent",
    description: "Geofence transition (enter, exit, dwell).",
  },
] as const;
