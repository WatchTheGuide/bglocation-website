export function Configuration() {
  return (
    <section id="configuration" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Configuration
      </h2>
      <p className="mt-2 text-muted-foreground">
        All options available in{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          configure()
        </code>
        . Call before{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          start()
        </code>
        .
      </p>

      {/* Core Options Table */}
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
              <tr>
                <td className="py-3 pr-4">
                  <code className="font-mono text-xs">distanceFilter</code>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  <code className="font-mono text-xs">{`number | 'auto'`}</code>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">15</td>
                <td className="py-3 text-muted-foreground">
                  Minimum distance in meters between location updates, or{" "}
                  <code className="font-mono text-xs">&apos;auto&apos;</code> for
                  speed-adaptive mode.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <code className="font-mono text-xs">desiredAccuracy</code>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  <code className="font-mono text-xs">string</code>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  &apos;high&apos;
                </td>
                <td className="py-3 text-muted-foreground">
                  <code className="font-mono text-xs">
                    &apos;high&apos;
                  </code>{" "}
                  |{" "}
                  <code className="font-mono text-xs">
                    &apos;balanced&apos;
                  </code>{" "}
                  |{" "}
                  <code className="font-mono text-xs">
                    &apos;low&apos;
                  </code>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <code className="font-mono text-xs">heartbeatInterval</code>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  <code className="font-mono text-xs">number</code>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">15</td>
                <td className="py-3 text-muted-foreground">
                  Heartbeat interval in seconds. Fires even when stationary.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <code className="font-mono text-xs">
                    locationUpdateInterval
                  </code>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  <code className="font-mono text-xs">number</code>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">5000</td>
                <td className="py-3 text-muted-foreground">
                  Update interval in ms. Android only.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <code className="font-mono text-xs">debug</code>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  <code className="font-mono text-xs">boolean</code>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">false</td>
                <td className="py-3 text-muted-foreground">
                  Enable verbose logging and{" "}
                  <code className="font-mono text-xs">onDebug</code> events.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* HTTP Config */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">HTTP Posting</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Send location updates directly from native code — no JS bridge
          overhead. Includes automatic offline buffering with retry.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`await BackgroundLocation.configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  locationUpdateInterval: 5000,
  fastestLocationUpdateInterval: 2000,
  http: {
    url: 'https://api.example.com/locations',
    headers: {
      Authorization: 'Bearer <token>',
    },
    buffer: {
      maxSize: 1000, // offline buffer capacity
    },
  },
});`}
        </pre>
        <p className="mt-3 text-sm text-muted-foreground">
          Each location is POSTed as JSON to the configured URL. The request is
          made from native code (URLSession on iOS, HttpURLConnection on
          Android) — no JS bridge overhead.
        </p>

        <h4 className="mt-6 font-semibold">HTTP POST Body</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          Every{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            onLocation
          </code>{" "}
          event triggers a POST with this JSON body:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`// POST https://api.example.com/locations
// Content-Type: application/json
{
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
}`}
        </pre>
        <p className="mt-3 text-sm text-muted-foreground">
          Heartbeats, getCurrentPosition(), and start/stop events do{" "}
          <strong>not</strong> trigger HTTP requests — only location updates do.
        </p>

        <h4 className="mt-6 font-semibold">HttpEvent (onHttp)</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          Every POST result fires the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            onHttp
          </code>{" "}
          event:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`interface HttpEvent {
  statusCode: number;       // HTTP code (0 = network error)
  success: boolean;         // true for 2xx responses
  responseText: string;     // response body
  error?: string;           // only present on network errors
  bufferedCount?: number;   // items in offline buffer (0 when empty)
}`}
        </pre>

        <h4 className="mt-6 font-semibold">Offline Buffer &amp; Retry</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          When{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            buffer.maxSize
          </code>{" "}
          is set, failed POSTs are stored in a local SQLite database (
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            bgl_location_buffer.db
          </code>
          ). Without{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            buffer
          </code>{" "}
          configured, failed requests are silently lost.
        </p>

        <h4 className="mt-6 font-semibold">How Flush Works</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          When the network recovers and the next{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            sendLocation()
          </code>{" "}
          succeeds, the plugin automatically starts flushing buffered
          locations. Each buffered location is sent as{" "}
          <strong>an individual POST</strong> with the same{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            {`{ "location": { ... } }`}
          </code>{" "}
          body format — your server receives the exact same payload for
          real-time and buffered locations.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>
            Flush sends up to <strong>50 locations per batch</strong>, one
            POST at a time (FIFO order).
          </li>
          <li>
            If any POST fails (non-2xx or network error), flush{" "}
            <strong>stops immediately</strong> and retries on the next
            successful send.
          </li>
          <li>
            When the buffer exceeds{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              maxSize
            </code>
            , the oldest entries are dropped automatically.
          </li>
          <li>
            Each{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              onHttp
            </code>{" "}
            event includes{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              bufferedCount
            </code>{" "}
            — the number of locations still waiting in the buffer.
          </li>
        </ul>

        <h4 className="mt-6 font-semibold">Server-side Considerations</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          Because each buffered location arrives as an individual POST, your
          server endpoint should:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>
            <strong>Handle rapid sequential requests</strong> — a buffer
            flush can send dozens of POSTs within seconds. Set your rate
            limiter high enough (e.g. 300 req/min per client).
          </li>
          <li>
            <strong>Return 2xx quickly</strong> — the flush sends requests
            sequentially and waits for each response. Slow responses delay
            the entire flush.
          </li>
          <li>
            <strong>Use idempotent inserts</strong> — each location includes
            a{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              timestamp
            </code>
            . Use it with latitude/longitude as a deduplication key to
            avoid storing the same location twice if a flush is retried.
          </li>
        </ul>

        <h4 className="mt-6 font-semibold">Buffer Timeline</h4>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`1. Network OK     → POST location → 200 OK
2. Network lost   → POST fails    → location saved to SQLite buffer
3. Still offline  → POST fails    → location saved (bufferedCount grows)
4. Network back   → POST location → 200 OK → flush starts
5. Flush          → POST buffered #1 → 200 → POST buffered #2 → 200 → ...
6. Flush done     → bufferedCount = 0`}
        </pre>
      </div>

      {/* Auto Distance Filter */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">Adaptive Distance Filter</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Set{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            {`distanceFilter: 'auto'`}
          </code>{" "}
          to dynamically adjust the filter based on speed (EMA smoothing),
          targeting consistent ~10s intervals regardless of transport mode.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`await BackgroundLocation.configure({
  distanceFilter: 'auto',
  autoDistanceFilter: {
    targetInterval: 10,  // seconds (default: 10)
    minDistance: 10,      // meters  (default: 10)
    maxDistance: 500,     // meters  (default: 500)
  },
  // ...other options
});`}
        </pre>
      </div>

      {/* Notification Config */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">
          Notification (Android)
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Customize the persistent foreground service notification on Android.
          Has no effect on iOS or Web.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`notification: {
  title: 'Tracking Active',
  text: 'Your location is being recorded',
}`}
        </pre>
      </div>
    </section>
  );
}
