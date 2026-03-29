"use client";

import { FrameworkSwitcher } from "@/components/framework/framework-switcher";
import { useFramework } from "@/components/framework/framework-provider";
import { Card, CardContent } from "@/components/ui/card";

const CAPACITOR_CODE_SNIPPET = `import { BackgroundLocation } from '@bglocation/capacitor';

// 1. Configure
await BackgroundLocation.configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  http: {
    url: 'https://api.example.com/location',
    headers: { Authorization: 'Bearer <token>' },
    buffer: { maxSize: 1000 },
  },
});

// 2. Listen
BackgroundLocation.addListener('onLocation', (loc) => {
  console.log(loc.latitude, loc.longitude);
});

// 3. Start
await BackgroundLocation.start();`;

const REACT_NATIVE_CODE_SNIPPET = `import {
  addListener,
  configure,
  removeAllListeners,
  start,
  stop,
} from '@bglocation/react-native';

// 1. Configure
await configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  http: {
    url: 'https://api.example.com/location',
    headers: { Authorization: 'Bearer <token>' },
    buffer: { maxSize: 1000 },
  },
});

// 2. Listen
const subscription = addListener('onLocation', (location) => {
  console.log(location.latitude, location.longitude);
});

// 3. Start
await start();

// later
subscription.remove();
await stop();
removeAllListeners();`;

export function CodeExample() {
  const { framework } = useFramework();

  return (
    <section className="border-y bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Up and Running in Minutes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Install from npm, configure once, start tracking. The native core is the
            same. The wrapper adapts to Capacitor or React Native.
          </p>
          <div className="mt-6 flex justify-center">
            <FrameworkSwitcher />
          </div>
        </div>

        <Card className="mx-auto mt-12 max-w-3xl overflow-hidden">
          <CardContent className="p-0">
            <pre className="overflow-x-auto p-6 text-sm leading-relaxed">
              <code className="font-mono text-foreground">
                {framework === "capacitor" ? CAPACITOR_CODE_SNIPPET : REACT_NATIVE_CODE_SNIPPET}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
