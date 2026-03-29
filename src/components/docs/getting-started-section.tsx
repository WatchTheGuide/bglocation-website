"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { getFrameworkOption } from "@/lib/framework";

const CAPACITOR_INSTALL = `npm install @bglocation/capacitor
npx cap sync`;

const REACT_NATIVE_INSTALL = `npm install @bglocation/react-native
npx expo prebuild

# Bare React Native
cd ios && pod install`;

const CAPACITOR_START = `import { BackgroundLocation } from '@bglocation/capacitor';

await BackgroundLocation.configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  locationUpdateInterval: 5000,
  debug: true,
});

BackgroundLocation.addListener('onLocation', (location) => {
  console.log(location.latitude, location.longitude);
});

await BackgroundLocation.start();`;

const REACT_NATIVE_START = `import {
  addListener,
  configure,
  start,
} from '@bglocation/react-native';

await configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  locationUpdateInterval: 5000,
  debug: true,
});

const locationSubscription = addListener('onLocation', (location) => {
  console.log(location.latitude, location.longitude);
});

await start();

// later
locationSubscription.remove();`;

const CAPACITOR_STOP = `await BackgroundLocation.stop();
await BackgroundLocation.removeAllListeners();`;

const REACT_NATIVE_STOP = `import { removeAllListeners, stop } from '@bglocation/react-native';

await stop();
removeAllListeners();`;

export function GettingStarted() {
  const { framework } = useFramework();
  const frameworkOption = getFrameworkOption(framework);

  return (
    <section id="getting-started" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Getting Started
      </h2>
      <p className="mt-2 text-muted-foreground">
        Install the {frameworkOption.label} wrapper, configure tracking, and get your first location
        update in under 5 minutes.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <h3 className="text-lg font-semibold">1. Install</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
            {framework === "capacitor" ? CAPACITOR_INSTALL : REACT_NATIVE_INSTALL}
          </pre>
        </div>

        <div>
          <h3 className="text-lg font-semibold">2. Configure &amp; Start</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
            {framework === "capacitor" ? CAPACITOR_START : REACT_NATIVE_START}
          </pre>
        </div>

        <div>
          <h3 className="text-lg font-semibold">3. Stop Tracking</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
            {framework === "capacitor" ? CAPACITOR_STOP : REACT_NATIVE_STOP}
          </pre>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium">Permissions</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {framework === "capacitor"
              ? "On Android 10+, request foreground permission first, then background. On iOS, call requestPermissions() and let the system handle the Always vs When In Use flow."
              : "The React Native wrapper uses the same permission model. Expo projects need a dev client and the config plugin. Bare React Native apps can request permissions through the exported requestPermissions() function after native setup is in place."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            React Native support targets <strong>0.76+</strong> with the New Architecture and TurboModules.
          </p>
        </div>
      </div>
    </section>
  );
}
