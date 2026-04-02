type ErrorRow = {
  code: string;
  description: string;
  fix: string;
};

const ERRORS: ErrorRow[] = [
  {
    code: "NOT_CONFIGURED",
    description: "An API method was called before configure().",
    fix: "Call configure() before start(), addGeofence(), getCurrentPosition(), etc.",
  },
  {
    code: "GEOFENCE_LIMIT_EXCEEDED",
    description: "Attempted to register more than 20 geofence regions.",
    fix: "Remove unused geofences before adding new ones. Use a rotation strategy for dynamic regions.",
  },
  {
    code: "GEOFENCE_ERROR",
    description: "Native geofence registration failed (invalid coordinates, system error).",
    fix: "Verify latitude, longitude, and radius values. Ensure in-range coordinates and radius > 0.",
  },
  {
    code: "UNSUPPORTED",
    description: "The operation is not supported on the current platform.",
    fix: "Check the Platform Differences page to verify feature availability on your target platform.",
  },
  {
    code: "TRIAL_COOLDOWN",
    description: "start() called during the 1-hour trial cooldown period.",
    fix: "Wait for the cooldown to expire, or configure a license key to unlock full mode.",
  },
  {
    code: "PERMISSION_DENIED",
    description: "Required location permissions have not been granted.",
    fix: "Call requestPermissions() first. On iOS, ensure Info.plist descriptions are set. On Android, ensure manifest permissions.",
  },
];

export function ErrorCodesSection() {
  return (
    <div className="mt-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Error Codes</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        All errors thrown by the plugin use string error codes. Catch them in your promise rejection handler and match on the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">code</code> property.
      </p>

      {/* Error Handling Example */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Catching Errors</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{`try {
  await start();
} catch (error: any) {
  switch (error.code) {
    case 'NOT_CONFIGURED':
      console.error('Call configure() first');
      break;
    case 'PERMISSION_DENIED':
      console.error('Location permission required');
      break;
    default:
      console.error('Unexpected error:', error.message);
  }
}`}</pre>
      </div>

      {/* Error Code Reference */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Error Code Reference</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Code</th>
                <th className="pb-3 pr-4 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ERRORS.map((error) => (
                <tr key={error.code}>
                  <td className="py-3 pr-4">
                    <code className="whitespace-nowrap font-mono text-xs">{error.code}</code>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{error.description}</td>
                  <td className="py-3 text-muted-foreground">{error.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HTTP Errors */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">HTTP Event Errors</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          HTTP posting errors are delivered via the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onHttp</code> event, not thrown as exceptions. Check <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">event.success</code> and <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">event.statusCode</code>:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{`addListener('onHttp', (event) => {
  if (!event.success) {
    console.error(\`HTTP \${event.statusCode}: \${event.error}\`);
    console.log(\`Buffered: \${event.bufferedCount}\`);
  }
});`}</pre>
      </div>

      {/* License Errors */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">License Validation Errors</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          License errors do not throw — they are returned in the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">ConfigureResult</code> object:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Error</th>
                <th className="pb-3 font-semibold">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">Bundle ID mismatch</td>
                <td className="py-3 text-muted-foreground">The license key was issued for a different app identifier.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">Invalid signature</td>
                <td className="py-3 text-muted-foreground">The license payload is corrupted or tampered with.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">Update expired</td>
                <td className="py-3 text-muted-foreground">The plugin version was released after the update window. Plugin still works, but you should renew or pin a compatible version.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
