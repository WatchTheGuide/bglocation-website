"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { getFrameworkOption, type Framework } from "@/lib/framework";

type MethodRow = {
  name: string;
  returns: string;
  description: string;
};

type EventRow = {
  name: string;
  payload: string;
  description: string;
};

const SHARED_EVENTS: EventRow[] = [
  { name: "onLocation", payload: "Location", description: "Location update based on distanceFilter." },
  { name: "onHeartbeat", payload: "HeartbeatEvent", description: "Periodic heartbeat, even when stationary." },
  { name: "onProviderChange", payload: "ProviderChangeEvent", description: "GPS/network provider status changed." },
  { name: "onHttp", payload: "HttpEvent", description: "Native HTTP POST result." },
  { name: "onDebug", payload: "DebugEvent", description: "Debug log message when debug mode is enabled." },
  { name: "onBatteryWarning", payload: "BatteryWarningEvent", description: "Battery optimization warning on Android." },
  { name: "onAccuracyWarning", payload: "AccuracyWarningEvent", description: "Approximate location warning on iOS 14+." },
  { name: "onMockLocation", payload: "MockLocationEvent", description: "Mock location detected on Android." },
  { name: "onPermissionRationale", payload: "PermissionRationaleEvent", description: "Show a custom rationale before background permission." },
  { name: "onTrialExpired", payload: "TrialExpiredEvent", description: "Trial session ended and tracking stopped automatically." },
  { name: "onGeofence", payload: "GeofenceEvent", description: "Geofence transition: enter, exit, or dwell." },
];

const LOCATION_INTERFACE = `interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  heading: number;
  altitude: number;
  timestamp: number;
  isMoving: boolean;
  isMock: boolean;
  effectiveDistanceFilter?: number;
}`;

const GEOFENCE_INTERFACE = `interface Geofence {
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;
  notifyOnEntry?: boolean;
  notifyOnExit?: boolean;
  notifyOnDwell?: boolean;
  dwellDelay?: number;
  extras?: Record<string, string>;
}`;

const GEOFENCE_EVENT_INTERFACE = `interface GeofenceEvent {
  identifier: string;
  action: 'enter' | 'exit' | 'dwell';
  location: Location | null;
  extras?: Record<string, string>;
  timestamp: number;
}`;

function getMethods(framework: Framework): MethodRow[] {
  return [
    { name: "getVersion()", returns: "Promise<VersionInfo>", description: "Get wrapper and native core version information." },
    { name: "checkPermissions()", returns: "Promise<LocationPermissionStatus>", description: "Check current foreground and background permission state." },
    { name: "requestPermissions(options?)", returns: "Promise<LocationPermissionStatus>", description: "Request foreground or background location permissions." },
    { name: "configure(options)", returns: "Promise<ConfigureResult>", description: "Configure tracking before start(); partial updates are merged." },
    { name: "start()", returns: "Promise<LocationState>", description: "Start background location tracking." },
    { name: "stop()", returns: "Promise<LocationState>", description: "Stop background location tracking." },
    { name: "getState()", returns: "Promise<LocationState>", description: "Read the current enabled/tracking state." },
    { name: "getCurrentPosition(options?)", returns: "Promise<Location>", description: "Request a single location update." },
    { name: "addGeofence(geofence)", returns: "Promise<void>", description: "Register one geofence region." },
    { name: "addGeofences({ geofences })", returns: "Promise<void>", description: "Register multiple geofences atomically." },
    { name: "removeGeofence({ identifier })", returns: "Promise<void>", description: "Remove a geofence by identifier." },
    { name: "removeAllGeofences()", returns: "Promise<void>", description: "Clear all geofences." },
    { name: "getGeofences()", returns: "Promise<{ geofences: Geofence[] }>", description: "Return the currently registered geofences." },
    { name: "checkBatteryOptimization()", returns: "Promise<BatteryWarningEvent>", description: "Inspect Android battery optimization state." },
    { name: "requestBatteryOptimization()", returns: "Promise<BatteryWarningEvent>", description: "Open Android battery optimization settings." },
    {
      name: "removeAllListeners()",
      returns: framework === "capacitor" ? "Promise<void>" : "void",
      description: "Remove all active event listeners registered through the wrapper.",
    },
  ];
}

export function ApiReference() {
  const { framework } = useFramework();
  const frameworkOption = getFrameworkOption(framework);
  const methods = getMethods(framework);

  return (
    <section id="api-reference" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">API Reference</h2>
      <p className="mt-2 text-muted-foreground">
        Complete TypeScript API exported by <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{frameworkOption.packageName}</code>.
      </p>

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
              {methods.map((method) => (
                <tr key={method.name}>
                  <td className="py-3 pr-4"><code className="font-mono text-xs">{method.name}</code></td>
                  <td className="py-3 pr-4 text-muted-foreground"><code className="font-mono text-xs">{method.returns}</code></td>
                  <td className="py-3 text-muted-foreground">{method.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">Events</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {framework === "capacitor"
            ? "Register listeners via BackgroundLocation.addListener(event, handler)."
            : "Register listeners via addListener(event, handler) and keep the returned Subscription so you can remove it later."}
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
              {SHARED_EVENTS.map((event) => (
                <tr key={event.name}>
                  <td className="py-3 pr-4"><code className="font-mono text-xs">{event.name}</code></td>
                  <td className="py-3 pr-4 text-muted-foreground"><code className="font-mono text-xs">{event.payload}</code></td>
                  <td className="py-3 text-muted-foreground">{event.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">Location Object</h3>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{LOCATION_INTERFACE}</pre>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">Geofencing</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Geofencing is available through the same API surface in both wrappers. Up to 20 regions can be active at once.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{GEOFENCE_INTERFACE}</pre>

        <h4 className="mt-6 font-semibold">GeofenceEvent Interface</h4>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{GEOFENCE_EVENT_INTERFACE}</pre>

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
                <td className="py-3 text-muted-foreground">configure() must run before adding geofences.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">GEOFENCE_LIMIT_EXCEEDED</code></td>
                <td className="py-3 text-muted-foreground">The wrapper enforces the 20 geofence limit.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">GEOFENCE_ERROR</code></td>
                <td className="py-3 text-muted-foreground">Native registration failed.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">UNSUPPORTED</code></td>
                <td className="py-3 text-muted-foreground">The current runtime does not support the attempted native operation.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
