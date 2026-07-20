"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";

const CAPACITOR_CONFIG = `import { BackgroundLocation } from '@bglocation/capacitor';

await BackgroundLocation.configure({
  distanceFilter: 50,
  http: { url: 'https://api.example.com/locations' },
  autoResumeOnKill: true, // ← opt in (default: false)
});

await BackgroundLocation.start();`;

const REACT_NATIVE_CONFIG = `import { configure, start } from '@bglocation/react-native';

await configure({
  distanceFilter: 50,
  http: { url: 'https://api.example.com/locations' },
  autoResumeOnKill: true, // ← opt in (default: false)
});

await start();`;

const CAPACITOR_HOOK = `// ios/App/App/AppDelegate.swift
import UIKit
import Capacitor
import CapacitorBackgroundLocation

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    // Must be the FIRST line — runs before the Capacitor bridge.
    BGLocationCapacitor.handleApplicationLaunch(launchOptions: launchOptions)
    return true
  }
}`;

const REACT_NATIVE_HOOK = `// ios/AppDelegate.swift
import UIKit
import BGLocationReactNative

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    // Must be the FIRST line — runs before the RN bridge.
    BGLocationReactNative.handleApplicationLaunch(launchOptions: launchOptions)
    return true
  }
}`;

const IOS_SEQUENCE = `device moves ~500 m
        │
        ▼
iOS relaunches the app in the background (no UI, no JS bridge)
        │
        ▼
AppDelegate hook → BGLPluginRuntime.handleApplicationLaunch
        │
        ▼
gates pass → reload config, restart tracking, flush offline buffer
        │
        ▼
queued GPS fix → HTTP POST to your backend  (app never opened)`;

const ANDROID_SEQUENCE = `OOM kill                         device reboot
   │                                  │
   ▼                                  ▼
START_STICKY revives service     BOOT_COMPLETED → BGLBootCompletedReceiver
   │                                  │ (re-registers geofences, age ≤ 7 days)
   └──────────────┬───────────────────┘
                  ▼
        Service.onStartCommand → handleSystemRestart
                  │
                  ▼
        gates pass → reload config, flush buffer, startTracking
                  │
                  ▼
        fused location → HTTP POST to your backend  (app never opened)`;

export function LifecycleSection() {
  const { framework } = useFramework();
  const isCapacitor = framework === "capacitor";

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Lifecycle & Auto-Resume</h1>
        <FrameworkSwitcher compact />
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        With the opt-in <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">autoResumeOnKill</code> flag, bglocation can resume background tracking after the app process is killed — a user force-quit on iOS or an OOM kill on Android — and keep delivering locations to your backend without the user reopening the app.
      </p>

      {/* Opt-in callout */}
      <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium">Opt-in by default</p>
        <p className="mt-2 text-sm text-muted-foreground">
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">autoResumeOnKill</code> defaults to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">false</code>. Without it, a user killing the app ends the session — the same behaviour as most location plugins. Enabling it has App Store / Play Store privacy implications: see the store-policy disclosure requirements before shipping.
        </p>
      </div>

      {/* Enable */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Enabling Auto-Resume</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm leading-relaxed">
          {isCapacitor ? CAPACITOR_CONFIG : REACT_NATIVE_CONFIG}
        </pre>
      </div>

      {/* iOS */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">iOS — Significant Location Change</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          iOS does not keep a killed app alive. If the app registered Significant Location Change monitoring, iOS relaunches it in the background after ~500 m of movement — but in that launch <strong>no {isCapacitor ? "WebView/Capacitor" : "JS/React Native"} bridge boots</strong>, so the plugin classes never get created.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-xs leading-relaxed">{IOS_SEQUENCE}</pre>

        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm font-medium">Required: AppDelegate hook</p>
          <p className="mt-2 text-sm text-muted-foreground">
            On iOS you <strong>must</strong> add a one-line hook to your <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">AppDelegate</code>. It runs before the framework bridge and is what re-arms tracking on a cold launch. Without it, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">autoResumeOnKill</code> is silently ignored after a kill — no crash, the feature just won&apos;t fire.
          </p>
        </div>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm leading-relaxed">
          {isCapacitor ? CAPACITOR_HOOK : REACT_NATIVE_HOOK}
        </pre>
        {!isCapacitor && (
          <p className="mt-3 text-sm text-muted-foreground">
            The API is <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">@objc</code>-callable, so a bare Objective-C++ <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">AppDelegate.mm</code> can call <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">[BGLocationReactNative handleApplicationLaunchWithLaunchOptions:launchOptions]</code> too.
          </p>
        )}
      </div>

      {/* Android */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Android — Service Restart & Boot</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Android keeps tracking alive in a foreground service. The OS revives it after an OOM kill (<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">START_STICKY</code>) and the plugin restarts it after a device reboot. <strong>No host-app code is required</strong> — both entry points live inside the plugin.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-xs leading-relaxed">{ANDROID_SEQUENCE}</pre>
      </div>

      {/* Stop is sticky */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Stop Ends the Session</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Calling <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">stop()</code> clears the persisted session flag. After a stop, no OS mechanism revives tracking — even if Android restarts the service via <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">START_STICKY</code>, it detects the stop and calls <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">stopSelf()</code>. Auto-resume only ever continues a session the user was actively running.
        </p>
      </div>

      {/* When NOT possible */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">When Auto-Resume Is Not Possible</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">autoResumeOnKill</code> is unset or <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">false</code> (the default).</li>
          <li>The user called <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">stop()</code> before the kill — the session flag is cleared.</li>
          <li><strong>iOS:</strong> the AppDelegate hook was not added — the flag is silently ignored on cold launch.</li>
          <li><strong>iOS:</strong> the user has not granted &quot;Always&quot; location permission — Significant Location Change requires it.</li>
          <li><strong>iOS:</strong> movement stays below the ~500 m wake threshold.</li>
          <li><strong>Android:</strong> the user chose <strong>Force stop</strong> in Settings — Android blocks <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">START_STICKY</code> until the app is relaunched manually. This is native OS behaviour.</li>
          <li><strong>Android (OEM):</strong> aggressive vendors (Xiaomi/MIUI, Huawei, …) may block service revival or boot restart unless the app is allow-listed for autostart.</li>
          <li>The trial-license cooldown is active.</li>
          <li>The persisted state is older than its age limit (see below).</li>
        </ul>
      </div>

      {/* Age limits */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Staleness Limits</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Old persisted state is ignored so the app never surprises a user with tracking they enabled long ago.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Resume path</th>
                <th className="pb-3 font-semibold">Maximum age</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">iOS cold launch / Android OOM restart</td>
                <td className="py-3 text-muted-foreground">30 days</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">Android boot restart</td>
                <td className="py-3 text-muted-foreground">7 days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Debug visibility */}
      <div className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium">Verifying it works</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Enable <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">debug: true</code> and listen for <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onDebug</code>. Events emitted while the app was killed are queued natively and replayed to JavaScript when the bridge comes back, so after reopening the app you&apos;ll see the resume log (<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">resumed tracking …</code>) and any HTTP POSTs that happened in the background.
        </p>
      </div>
    </div>
  );
}
