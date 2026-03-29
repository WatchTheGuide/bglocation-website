"use client";

import { useFramework } from "@/components/framework/framework-provider";

const CAPACITOR_FLEET = `import { BackgroundLocation } from '@bglocation/capacitor';

await BackgroundLocation.configure({
  distanceFilter: 'auto',
  autoDistanceFilter: {
    targetInterval: 10,
    minDistance: 10,
    maxDistance: 500,
  },
  desiredAccuracy: 'high',
  heartbeatInterval: 30,
  http: {
    url: 'https://api.fleet.com/vehicle/location',
    headers: { Authorization: 'Bearer <token>' },
    buffer: { maxSize: 2000 },
  },
});

BackgroundLocation.addListener('onHttp', (event) => {
  if (!event.success) {
    console.warn('Buffered:', event.bufferedCount);
  }
});

await BackgroundLocation.start();`;

const REACT_NATIVE_FLEET = `import { addListener, configure, start } from '@bglocation/react-native';

await configure({
  distanceFilter: 'auto',
  autoDistanceFilter: {
    targetInterval: 10,
    minDistance: 10,
    maxDistance: 500,
  },
  desiredAccuracy: 'high',
  heartbeatInterval: 30,
  http: {
    url: 'https://api.fleet.com/vehicle/location',
    headers: { Authorization: 'Bearer <token>' },
    buffer: { maxSize: 2000 },
  },
});

addListener('onHttp', (event) => {
  if (!event.success) {
    console.warn('Buffered:', event.bufferedCount);
  }
});

await start();`;

const CAPACITOR_FITNESS = `import { BackgroundLocation } from '@bglocation/capacitor';
import type { Location } from '@bglocation/capacitor';

const route: Location[] = [];

await BackgroundLocation.configure({
  distanceFilter: 5,
  desiredAccuracy: 'high',
  heartbeatInterval: 10,
  locationUpdateInterval: 3000,
});

BackgroundLocation.addListener('onLocation', (location) => {
  route.push(location);
  updateMapPolyline(route);
});

await BackgroundLocation.start();`;

const REACT_NATIVE_FITNESS = `import {
  addListener,
  configure,
  start,
} from '@bglocation/react-native';
import type { Location } from '@bglocation/react-native';

const route: Location[] = [];

await configure({
  distanceFilter: 5,
  desiredAccuracy: 'high',
  heartbeatInterval: 10,
  locationUpdateInterval: 3000,
});

addListener('onLocation', (location) => {
  route.push(location);
  updateMapPolyline(route);
});

await start();`;

const CAPACITOR_GEOFENCE = `import { BackgroundLocation } from '@bglocation/capacitor';

await BackgroundLocation.configure({
  distanceFilter: 50,
  desiredAccuracy: 'balanced',
  heartbeatInterval: 60,
});

await BackgroundLocation.addGeofence({
  identifier: 'office',
  latitude: 52.2297,
  longitude: 21.0122,
  radius: 100,
  notifyOnEntry: true,
  notifyOnExit: true,
});

BackgroundLocation.addListener('onGeofence', (event) => {
  console.log(event.identifier, event.action);
});

await BackgroundLocation.start();`;

const REACT_NATIVE_GEOFENCE = `import {
  addGeofence,
  addListener,
  configure,
  start,
} from '@bglocation/react-native';

await configure({
  distanceFilter: 50,
  desiredAccuracy: 'balanced',
  heartbeatInterval: 60,
});

await addGeofence({
  identifier: 'office',
  latitude: 52.2297,
  longitude: 21.0122,
  radius: 100,
  notifyOnEntry: true,
  notifyOnExit: true,
});

addListener('onGeofence', (event) => {
  console.log(event.identifier, event.action);
});

await start();`;

export function Examples() {
  const { framework } = useFramework();

  return (
    <section id="examples" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Examples</h2>
      <p className="mt-2 text-muted-foreground">
        Real-world integration patterns for common production use cases.
      </p>

      <div className="mt-8">
        <h3 className="text-lg font-semibold">Fleet / Delivery Tracking</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Continuous tracking with native HTTP posting and automatic offline buffering.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_FLEET : REACT_NATIVE_FLEET}
        </pre>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">Fitness / Running App</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          High-frequency tracking with in-memory processing for pace, route, and progress stats.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_FITNESS : REACT_NATIVE_FITNESS}
        </pre>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">Geofencing — Points of Interest</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Register circular regions and react to enter, exit, and dwell transitions.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_GEOFENCE : REACT_NATIVE_GEOFENCE}
        </pre>
      </div>
    </section>
  );
}
