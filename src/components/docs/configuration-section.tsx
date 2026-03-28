"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { getFrameworkOption } from "@/lib/framework";

const CORE_OPTIONS = [
  {
    option: "distanceFilter",
    type: "number | 'auto'",
    defaultValue: "15",
    description: "Minimum distance in meters between updates, or 'auto' for speed-adaptive mode.",
  },
  {
    option: "desiredAccuracy",
    type: "'high' | 'balanced' | 'low'",
    defaultValue: "'high'",
    description: "Accuracy preset used by the native location manager.",
  },
  {
    option: "heartbeatInterval",
    type: "number",
    defaultValue: "15",
    description: "Heartbeat interval in seconds. Fires even when stationary.",
  },
  {
    option: "locationUpdateInterval",
    type: "number",
    defaultValue: "5000",
    description: "Android-only update interval in milliseconds.",
  },
  {
    option: "fastestLocationUpdateInterval",
    type: "number",
    defaultValue: "2000",
    description: "Android-only lower bound for high-frequency updates.",
  },
  {
    option: "debug",
    type: "boolean",
    defaultValue: "false",
    description: "Enables verbose logs and onDebug events.",
  },
] as const;

const CAPACITOR_HTTP_SNIPPET = `await BackgroundLocation.configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  locationUpdateInterval: 5000,
  fastestLocationUpdateInterval: 2000,
  http: {
    url: 'https://api.example.com/locations',
    headers: { Authorization: 'Bearer <token>' },
    buffer: { maxSize: 1000 },
  },
});`;

const REACT_NATIVE_HTTP_SNIPPET = `await configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  locationUpdateInterval: 5000,
  fastestLocationUpdateInterval: 2000,
  http: {
    url: 'https://api.example.com/locations',
    headers: { Authorization: 'Bearer <token>' },
    buffer: { maxSize: 1000 },
  },
});`;

const AUTO_DISTANCE_SNIPPET = `distanceFilter: 'auto',
autoDistanceFilter: {
  targetInterval: 10,
  minDistance: 10,
  maxDistance: 500,
}`;

const NOTIFICATION_SNIPPET = `notification: {
  title: 'Background Location',
  text: 'Tracking your route',
}`;

const HTTP_POST_BODY = `{
  "location": {
    "latitude": 52.2297,
    "longitude": 21.0122,
    "accuracy": 5.0,
    "speed": 1.2,
    "heading": 180.0,
    "altitude": 110.5,
    "timestamp": 1700000000000,
    "isMoving": true,
    "isMock": false
  }
}`;

const HTTP_EVENT = `interface HttpEvent {
  statusCode: number;
  success: boolean;
  responseText: string;
  error?: string;
  bufferedCount?: number;
}`;

export function Configuration() {
  const { framework } = useFramework();
  const frameworkOption = getFrameworkOption(framework);

  return (
    <section id="configuration" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Configuration</h2>
      <p className="mt-2 text-muted-foreground">
        All options available in <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">configure()</code>.
        The {frameworkOption.label} wrapper mirrors the same native config surface and merges partial updates.
      </p>

      <div className="mt-8">
        <h3 className="text-lg font-semibold">Core Options</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Option</th>
                <th className="pb-3 pr-4 font-semibold">Type</th>
                <th className="pb-3 pr-4 font-semibold">Default</th>
                <th className="pb-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {CORE_OPTIONS.map((row) => (
                <tr key={row.option}>
                  <td className="py-3 pr-4"><code className="font-mono text-xs">{row.option}</code></td>
                  <td className="py-3 pr-4 text-muted-foreground"><code className="font-mono text-xs">{row.type}</code></td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.defaultValue}</td>
                  <td className="py-3 text-muted-foreground">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">HTTP Posting</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Native HTTP delivery works the same in Capacitor and React Native. The JavaScript wrapper configures it once,
          then URLSession on iOS and HttpURLConnection on Android post directly from the native layer.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_HTTP_SNIPPET : REACT_NATIVE_HTTP_SNIPPET}
        </pre>

        <h4 className="mt-6 font-semibold">HTTP POST Body</h4>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{HTTP_POST_BODY}</pre>

        <h4 className="mt-6 font-semibold">HttpEvent</h4>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{HTTP_EVENT}</pre>

        <h4 className="mt-6 font-semibold">Offline Buffer &amp; Retry</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          Failed POSTs are stored in SQLite when <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">buffer.maxSize</code>
          is configured. Buffered locations flush automatically in FIFO order after the next successful request.
        </p>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">Adaptive Distance Filter</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Use auto mode to target stable update intervals regardless of whether the user is walking, cycling, or driving.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{AUTO_DISTANCE_SNIPPET}</pre>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">Notification (Android)</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Android tracking runs as a foreground service. Customize the persistent notification text from the wrapper.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{NOTIFICATION_SNIPPET}</pre>
      </div>

      <div className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium">Partial Reconfiguration</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Subsequent <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">configure()</code> calls merge with the last
          applied config. Pass only the fields you want to change.
        </p>
      </div>
    </section>
  );
}
