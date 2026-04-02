const CONFIG_INTERFACE = `interface AutoDistanceFilterConfig {
  targetInterval?: number;  // seconds between updates (default: 10)
  minDistance?: number;      // minimum filter in meters (default: 10)
  maxDistance?: number;      // maximum filter in meters (default: 500)
}`;

const USE_CASES = [
  {
    useCase: "Walking / Hiking",
    targetInterval: "8–12",
    minDistance: "5–10",
    maxDistance: "100–200",
    notes: "Frequent updates at low speed, caps filter for paused movement.",
  },
  {
    useCase: "Cycling",
    targetInterval: "8–10",
    minDistance: "10–15",
    maxDistance: "300",
    notes: "Balanced for moderate speeds, smooth polyline.",
  },
  {
    useCase: "Driving / Fleet",
    targetInterval: "10–15",
    minDistance: "10–20",
    maxDistance: "500–1000",
    notes: "Larger max for highway speeds, reduces battery drain.",
  },
  {
    useCase: "Delivery / Mixed",
    targetInterval: "10",
    minDistance: "10",
    maxDistance: "500",
    notes: "Default values work well for mixed walking + driving.",
  },
];

export function AdaptiveFilterSection() {
  return (
    <div className="mt-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Adaptive Distance Filter</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The auto distance filter adjusts the minimum distance between location updates based on the device&apos;s current speed. Slower movement produces smaller filters (more precision), faster movement produces larger filters (less battery drain).
      </p>

      {/* How It Works */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          When <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">distanceFilter: &apos;auto&apos;</code> is set, the plugin calculates{" "}
          the distance filter dynamically from each received location&apos;s speed value. The goal is to maintain a consistent time interval between updates (configured by <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">targetInterval</code>).
        </p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li><strong>Low speed (walking):</strong> Filter shrinks to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">minDistance</code> — frequent, precise updates.</li>
          <li><strong>Moderate speed (cycling):</strong> Filter grows proportionally — balanced updates.</li>
          <li><strong>High speed (driving):</strong> Filter grows to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">maxDistance</code> — fewer updates, less battery.</li>
          <li><strong>Stationary:</strong> Filter stays at <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">minDistance</code>, heartbeats fire normally.</li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          The current effective filter is returned in the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">effectiveDistanceFilter</code> field of each <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Location</code> object.
        </p>
      </div>

      {/* Configuration */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Configuration</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{CONFIG_INTERFACE}</pre>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{`await configure({
  distanceFilter: 'auto',
  autoDistanceFilter: {
    targetInterval: 10,   // aim for ~10 seconds between updates
    minDistance: 10,       // never go below 10 meters
    maxDistance: 500,      // never exceed 500 meters
  },
});`}</pre>
      </div>

      {/* Recommendations */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Recommended Settings by Use Case</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Use Case</th>
                <th className="pb-3 pr-4 font-semibold">targetInterval (s)</th>
                <th className="pb-3 pr-4 font-semibold">minDistance (m)</th>
                <th className="pb-3 pr-4 font-semibold">maxDistance (m)</th>
                <th className="pb-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {USE_CASES.map((row) => (
                <tr key={row.useCase}>
                  <td className="py-3 pr-4 font-medium">{row.useCase}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.targetInterval}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.minDistance}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.maxDistance}</td>
                  <td className="py-3 text-muted-foreground">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fixed vs Auto */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">When to Use Auto vs Fixed</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold text-green-600 dark:text-green-400">Use Auto When</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Users switch between transport modes</li>
              <li>Battery optimization is a priority</li>
              <li>Time-based update intervals are preferred over distance-based</li>
              <li>Fleet / delivery tracking with mixed driving and walking</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold text-blue-600 dark:text-blue-400">Use Fixed When</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Consistent precision is needed regardless of speed</li>
              <li>The app targets a single transport mode</li>
              <li>You need exact distance-based granularity (e.g., every 10m)</li>
              <li>Fitness tracking where polyline accuracy matters most</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ConfigureResult */}
      <div className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium">Check Active Mode</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">ConfigureResult</code> includes <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">distanceFilterMode: &apos;auto&apos; | &apos;fixed&apos;</code> so you can confirm which mode is active after calling <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">configure()</code>.
        </p>
      </div>
    </div>
  );
}
