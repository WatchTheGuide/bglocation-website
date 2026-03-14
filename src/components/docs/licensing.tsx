export function Licensing() {
  return (
    <section id="licensing" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Licensing
      </h2>
      <p className="mt-2 text-muted-foreground">
        How license keys work, trial mode behavior, and offline validation.
      </p>

      {/* Trial Mode */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Trial Mode</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Without a license key, the plugin runs in trial mode — all features
          are available, but with these restrictions:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>30-minute sessions</strong> — tracking automatically stops
              after 30 minutes. The{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                onTrialExpired
              </code>{" "}
              event is emitted.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>1-hour cooldown</strong> — after a session expires, you
              must wait 1 hour before starting another.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>Debug forced on</strong> — verbose logging is always active
              in trial mode.
            </span>
          </li>
        </ul>
      </div>

      {/* License Key */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">Adding a License Key</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          After purchase, add your license key to{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            capacitor.config.ts
          </code>
          :
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.app',
  plugins: {
    BackgroundLocation: {
      licenseKey: 'BGL1-eyJ...',
    },
  },
};

export default config;`}
        </pre>
        <p className="mt-3 text-sm text-muted-foreground">
          Then run{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            npx cap sync
          </code>{" "}
          to apply the key to both platforms.
        </p>
      </div>

      {/* How It Works */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">How Validation Works</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>RSA-2048 cryptographic validation</strong> — the key is a
              signed payload containing your bundle ID and optional update
              access period.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>Fully offline</strong> — no server calls, no phone-home.
              The public key is embedded in the plugin binary.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>Bundle ID bound</strong> — the key works only for the
              specific bundle ID it was generated for. One key covers both iOS
              and Android (same bundle ID).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>Perpetual license</strong> — your key never expires.
              Purchase includes 1 year of plugin updates. After that, the
              plugin continues working on the last installed version.
            </span>
          </li>
        </ul>
      </div>

      {/* Configure Result */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">License Status</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            configure()
          </code>{" "}
          method returns the license validation result:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`const result = await BackgroundLocation.configure({ ... });

// result.licenseMode: 'full' | 'trial'
// result.licenseUpdatesUntil: '2027-03-14T...' (full mode, optional)
// result.licenseError: 'No license key provided' (trial mode only)`}
        </pre>
      </div>
    </section>
  );
}
