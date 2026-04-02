"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";

const CAPACITOR_HTTP = `import { BackgroundLocation } from '@bglocation/capacitor';

await BackgroundLocation.configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  http: {
    url: 'https://api.example.com/locations',
    headers: {
      Authorization: 'Bearer YOUR_TOKEN',
      'X-Device-Id': 'device-123',
    },
    buffer: {
      maxSize: 1000, // store up to 1000 locations offline
    },
  },
});

// Monitor HTTP delivery
BackgroundLocation.addListener('onHttp', (event) => {
  if (event.success) {
    console.log('✅ Delivered, status:', event.statusCode);
  } else {
    console.warn('❌ Failed:', event.error ?? event.statusCode);
    console.warn('   Buffered:', event.bufferedCount);
  }
});

await BackgroundLocation.start();`;

const REACT_NATIVE_HTTP = `import { addListener, configure, start } from '@bglocation/react-native';

await configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  http: {
    url: 'https://api.example.com/locations',
    headers: {
      Authorization: 'Bearer YOUR_TOKEN',
      'X-Device-Id': 'device-123',
    },
    buffer: {
      maxSize: 1000, // store up to 1000 locations offline
    },
  },
});

// Monitor HTTP delivery
addListener('onHttp', (event) => {
  if (event.success) {
    console.log('✅ Delivered, status:', event.statusCode);
  } else {
    console.warn('❌ Failed:', event.error ?? event.statusCode);
    console.warn('   Buffered:', event.bufferedCount);
  }
});

await start();`;

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

const HTTP_EVENT_INTERFACE = `interface HttpEvent {
  statusCode: number;       // HTTP status code (0 if network error)
  success: boolean;         // true if 2xx
  responseText: string;     // response body
  error?: string;           // error message on network failure
  bufferedCount?: number;   // locations waiting in offline buffer
}`;

const HTTP_CONFIG_INTERFACE = `interface HttpConfig {
  url: string;                           // POST endpoint
  headers?: Record<string, string>;      // custom headers
  buffer?: {
    maxSize?: number;                    // max offline entries (default: 1000)
  };
}`;

export function HttpPostingSection() {
  const { framework } = useFramework();

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">HTTP Posting & Offline Buffer</h1>
        <FrameworkSwitcher compact />
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        The plugin delivers location data directly from the native layer via HTTP POST. No JavaScript bridge overhead, no wake-lock required, and failed requests are buffered automatically.
      </p>

      {/* How it works */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-muted-foreground">
          <li>Each location update triggers a native HTTP POST to your configured URL.</li>
          <li>iOS uses <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">URLSession</code>, Android uses <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">HttpURLConnection</code> — both run natively without waking the JS runtime.</li>
          <li>If the request fails (no network, server error), the location is stored in a local SQLite database.</li>
          <li>On the next successful request, buffered locations are flushed automatically in FIFO order.</li>
          <li>The <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onHttp</code> event is emitted for every attempt, letting you monitor delivery in JavaScript.</li>
        </ol>
      </div>

      {/* Configuration */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Configuration</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{HTTP_CONFIG_INTERFACE}</pre>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Property</th>
                <th className="pb-3 pr-4 font-semibold">Required</th>
                <th className="pb-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">url</code></td>
                <td className="py-3 pr-4 text-muted-foreground">Yes</td>
                <td className="py-3 text-muted-foreground">The HTTPS endpoint that receives location POSTs.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">headers</code></td>
                <td className="py-3 pr-4 text-muted-foreground">No</td>
                <td className="py-3 text-muted-foreground">Custom HTTP headers. Typically used for Authorization tokens.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="font-mono text-xs">buffer.maxSize</code></td>
                <td className="py-3 pr-4 text-muted-foreground">No</td>
                <td className="py-3 text-muted-foreground">Maximum number of offline-buffered locations. Oldest entries are dropped when exceeded. Default: 1000.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* POST Body Format */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">POST Body Format</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Each POST sends a single location object as JSON. The <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Content-Type</code> header is set to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">application/json</code> automatically.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{HTTP_POST_BODY}</pre>
      </div>

      {/* onHttp Event */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">HttpEvent</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{HTTP_EVENT_INTERFACE}</pre>
      </div>

      {/* Offline Buffer */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Offline Buffer & Retry</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          When a POST fails (network offline, server 5xx, timeout), the location is pushed to a local SQLite buffer. On the next successful delivery, the plugin flushes buffered entries automatically in chronological order.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Buffer capacity is controlled by <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">buffer.maxSize</code> (default: 1000).</li>
          <li>When the buffer is full, the oldest entries are evicted to make room for new locations.</li>
          <li>The <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">bufferedCount</code> field in <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">HttpEvent</code> shows how many locations are waiting.</li>
          <li>Retry happens automatically — no manual intervention needed.</li>
        </ul>
      </div>

      {/* Bearer Token Example */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Complete Example with Authentication</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed">
          {framework === "capacitor" ? CAPACITOR_HTTP : REACT_NATIVE_HTTP}
        </pre>
      </div>

      {/* Tips */}
      <div className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium">Tips</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Use HTTPS — HTTP URLs are blocked on iOS by default (App Transport Security).</li>
          <li>Token rotation: call <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">configure({`{ http: { headers: { Authorization: 'Bearer newToken' } } }`})</code> to update headers without restarting.</li>
          <li>To disable HTTP posting, reconfigure without the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">http</code> key and restart tracking.</li>
        </ul>
      </div>
    </div>
  );
}
