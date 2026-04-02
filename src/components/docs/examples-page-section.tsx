"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { FrameworkSwitcher } from "@/components/framework/framework-switcher";

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

const CAPACITOR_ATTENDANCE = `import { BackgroundLocation } from '@bglocation/capacitor';

await BackgroundLocation.configure({
  distanceFilter: 100,
  desiredAccuracy: 'balanced',
  heartbeatInterval: 120,
  http: {
    url: 'https://api.company.com/attendance/checkin',
    headers: { Authorization: 'Bearer <token>' },
  },
});

// Register workplace geofence
await BackgroundLocation.addGeofence({
  identifier: 'headquarters',
  latitude: 52.2297,
  longitude: 21.0122,
  radius: 150,
  notifyOnEntry: true,
  notifyOnExit: true,
  extras: { building: 'HQ', floor: '3' },
});

BackgroundLocation.addListener('onGeofence', (event) => {
  if (event.action === 'enter') {
    recordCheckIn(event.identifier, event.extras);
  } else if (event.action === 'exit') {
    recordCheckOut(event.identifier, event.extras);
  }
});

await BackgroundLocation.start();`;

const REACT_NATIVE_ATTENDANCE = `import {
  addGeofence,
  addListener,
  configure,
  start,
} from '@bglocation/react-native';

await configure({
  distanceFilter: 100,
  desiredAccuracy: 'balanced',
  heartbeatInterval: 120,
  http: {
    url: 'https://api.company.com/attendance/checkin',
    headers: { Authorization: 'Bearer <token>' },
  },
});

// Register workplace geofence
await addGeofence({
  identifier: 'headquarters',
  latitude: 52.2297,
  longitude: 21.0122,
  radius: 150,
  notifyOnEntry: true,
  notifyOnExit: true,
  extras: { building: 'HQ', floor: '3' },
});

addListener('onGeofence', (event) => {
  if (event.action === 'enter') {
    recordCheckIn(event.identifier, event.extras);
  } else if (event.action === 'exit') {
    recordCheckOut(event.identifier, event.extras);
  }
});

await start();`;

export function ExamplesSection() {
  const { framework } = useFramework();

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Examples</h1>
        <FrameworkSwitcher compact />
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        Complete integration patterns for real-world use cases. Each example is production-ready — copy, adjust, and ship.
      </p>

      {/* Fleet Tracking */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Fleet / Delivery Tracking</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Continuous tracking with adaptive distance filter, native HTTP posting, and automatic offline buffering. Ideal for logistics and delivery apps.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_FLEET : REACT_NATIVE_FLEET}
        </pre>
      </div>

      {/* Fitness */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Fitness / Running App</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          High-frequency tracking with in-memory processing for pace, route, and progress stats. Low distance filter for detailed route polylines.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_FITNESS : REACT_NATIVE_FITNESS}
        </pre>
      </div>

      {/* Geofencing */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Geofencing — Points of Interest</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Register circular regions and react to enter, exit, and dwell transitions. Great for location-based notifications and triggered actions.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_GEOFENCE : REACT_NATIVE_GEOFENCE}
        </pre>
      </div>

      {/* Attendance */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Attendance / Check-In System</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Combine geofencing with HTTP posting for automatic workplace check-in and check-out. Uses geofence extras to attach metadata like building and floor.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {framework === "capacitor" ? CAPACITOR_ATTENDANCE : REACT_NATIVE_ATTENDANCE}
        </pre>
      </div>

      {/* Use Case Table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Recommended Configuration by Use Case</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Use Case</th>
                <th className="pb-3 pr-4 font-semibold">distanceFilter</th>
                <th className="pb-3 pr-4 font-semibold">heartbeat</th>
                <th className="pb-3 pr-4 font-semibold">accuracy</th>
                <th className="pb-3 font-semibold">Key Features</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3 pr-4 font-medium">Fleet tracking</td>
                <td className="py-3 pr-4 text-muted-foreground">auto</td>
                <td className="py-3 pr-4 text-muted-foreground">30s</td>
                <td className="py-3 pr-4 text-muted-foreground">high</td>
                <td className="py-3 text-muted-foreground">HTTP + buffer</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Fitness</td>
                <td className="py-3 pr-4 text-muted-foreground">5m</td>
                <td className="py-3 pr-4 text-muted-foreground">10s</td>
                <td className="py-3 pr-4 text-muted-foreground">high</td>
                <td className="py-3 text-muted-foreground">In-memory route</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Geofencing</td>
                <td className="py-3 pr-4 text-muted-foreground">50m</td>
                <td className="py-3 pr-4 text-muted-foreground">60s</td>
                <td className="py-3 pr-4 text-muted-foreground">balanced</td>
                <td className="py-3 text-muted-foreground">Geofence regions</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Attendance</td>
                <td className="py-3 pr-4 text-muted-foreground">100m</td>
                <td className="py-3 pr-4 text-muted-foreground">120s</td>
                <td className="py-3 pr-4 text-muted-foreground">balanced</td>
                <td className="py-3 text-muted-foreground">Geofence + HTTP</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
