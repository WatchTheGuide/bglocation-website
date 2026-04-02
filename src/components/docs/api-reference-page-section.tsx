"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";
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
      description: "Remove all active event listeners.",
    },
  ];
}

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

const LOCATION_CONFIG = `interface LocationConfig {
  distanceFilter?: number | 'auto';
  desiredAccuracy?: 'high' | 'balanced' | 'low' | 'passive';
  heartbeatInterval?: number;            // seconds (default: 15)
  locationUpdateInterval?: number;       // ms, Android minimum interval
  debug?: boolean;
  debugSounds?: boolean;
  autoDistanceFilter?: AutoDistanceFilterConfig;
  http?: HttpConfig;
  notification?: NotificationConfig;     // Android foreground notification
}`;

const HTTP_CONFIG = `interface HttpConfig {
  url: string;
  method?: 'POST';
  headers?: Record<string, string>;
  buffer?: {
    maxSize?: number;                   // default: 500
  };
}`;

const GEOFENCE_INTERFACE = `interface Geofence {
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;                        // meters
  notifyOnEntry?: boolean;
  notifyOnExit?: boolean;
  notifyOnDwell?: boolean;
  dwellDelay?: number;                   // seconds
  extras?: Record<string, string>;
}`;

const GEOFENCE_EVENT = `interface GeofenceEvent {
  identifier: string;
  action: 'enter' | 'exit' | 'dwell';
  location: Location | null;
  extras?: Record<string, string>;
  timestamp: number;
}`;

const CONFIGURE_RESULT = `interface ConfigureResult {
  licenseMode: 'full' | 'trial';
  licenseUpdatesUntil?: string;
  licenseUpdateExpired?: boolean;
  licenseError?: string;
}`;

const HEARTBEAT_EVENT = `interface HeartbeatEvent {
  location: Location;
  timestamp: number;
}`;

const HTTP_EVENT = `interface HttpEvent {
  success: boolean;
  statusCode: number;
  error?: string;
  bufferedCount: number;
  timestamp: number;
}`;

export function ApiReferenceSection() {
  const { framework } = useFramework();
  const frameworkOption = getFrameworkOption(framework);
  const methods = getMethods(framework);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">API Reference</h1>
        <FrameworkSwitcher compact />
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        Complete TypeScript API exported by{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{frameworkOption.packageName}</code>.
      </p>

      {/* Methods */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Methods</h2>
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
              {methods.map((m) => (
                <tr key={m.name}>
                  <td className="py-3 pr-4"><code className="font-mono text-xs">{m.name}</code></td>
                  <td className="py-3 pr-4 text-muted-foreground"><code className="font-mono text-xs">{m.returns}</code></td>
                  <td className="py-3 text-muted-foreground">{m.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Events */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Events</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {framework === "capacitor"
            ? "Register via BackgroundLocation.addListener(event, handler)."
            : "Register via addListener(event, handler). Keep the returned Subscription to unsubscribe later."}
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
              {SHARED_EVENTS.map((e) => (
                <tr key={e.name}>
                  <td className="py-3 pr-4"><code className="font-mono text-xs">{e.name}</code></td>
                  <td className="py-3 pr-4 text-muted-foreground"><code className="font-mono text-xs">{e.payload}</code></td>
                  <td className="py-3 text-muted-foreground">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interfaces */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Interfaces</h2>

        <h3 className="mt-6 text-lg font-semibold">Location</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{LOCATION_INTERFACE}</pre>

        <h3 className="mt-8 text-lg font-semibold">LocationConfig</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{LOCATION_CONFIG}</pre>

        <h3 className="mt-8 text-lg font-semibold">HttpConfig</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{HTTP_CONFIG}</pre>

        <h3 className="mt-8 text-lg font-semibold">Geofence</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{GEOFENCE_INTERFACE}</pre>

        <h3 className="mt-8 text-lg font-semibold">GeofenceEvent</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{GEOFENCE_EVENT}</pre>

        <h3 className="mt-8 text-lg font-semibold">ConfigureResult</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{CONFIGURE_RESULT}</pre>

        <h3 className="mt-8 text-lg font-semibold">HeartbeatEvent</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{HEARTBEAT_EVENT}</pre>

        <h3 className="mt-8 text-lg font-semibold">HttpEvent</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{HTTP_EVENT}</pre>
      </div>

      {/* Error Codes */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Error Codes</h2>
        <div className="mt-4 overflow-x-auto">
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
                <td className="py-3 text-muted-foreground">configure() must be called before this method.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">GEOFENCE_LIMIT_EXCEEDED</code></td>
                <td className="py-3 text-muted-foreground">Maximum of 20 geofence regions reached.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">GEOFENCE_ERROR</code></td>
                <td className="py-3 text-muted-foreground">Native geofence registration failed.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">UNSUPPORTED</code></td>
                <td className="py-3 text-muted-foreground">Operation not supported on the current platform.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">TRIAL_COOLDOWN</code></td>
                <td className="py-3 text-muted-foreground">Trial cooldown period is active.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">PERMISSION_DENIED</code></td>
                <td className="py-3 text-muted-foreground">Required location permissions not granted.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
