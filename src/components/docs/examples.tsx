export function Examples() {
  return (
    <section id="examples" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Examples
      </h2>
      <p className="mt-2 text-muted-foreground">
        Real-world integration patterns for common use cases.
      </p>

      {/* Fleet Tracking */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Fleet / Delivery Tracking</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Continuous tracking with server-side posting. Use auto distance filter
          for consistent updates regardless of vehicle speed.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`import { BackgroundLocation } from 'capacitor-bglocation';

await BackgroundLocation.configure({
  distanceFilter: 'auto',
  autoDistanceFilter: {
    targetInterval: 10,
    minDistance: 10,
    maxDistance: 500,
  },
  desiredAccuracy: 'high',
  heartbeatInterval: 30,
  locationUpdateInterval: 5000,
  fastestLocationUpdateInterval: 2000,
  http: {
    url: 'https://api.fleet.com/vehicle/location',
    headers: { Authorization: 'Bearer <token>' },
    buffer: { maxSize: 2000 },
  },
  notification: {
    title: 'Route Active',
    text: 'Tracking your delivery route',
  },
});

BackgroundLocation.addListener('onHttp', (event) => {
  if (!event.success) {
    console.warn('Buffered:', event.bufferedCount);
  }
});

await BackgroundLocation.start();`}
        </pre>
      </div>

      {/* Fitness App */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">Fitness / Running App</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          High-frequency tracking with local processing. Keep locations in
          memory and sync on demand.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`import { BackgroundLocation } from 'capacitor-bglocation';
import type { Location } from 'capacitor-bglocation';

const route: Location[] = [];

await BackgroundLocation.configure({
  distanceFilter: 5,
  desiredAccuracy: 'high',
  heartbeatInterval: 10,
  locationUpdateInterval: 3000,
  fastestLocationUpdateInterval: 1000,
  debug: false,
});

BackgroundLocation.addListener('onLocation', (location) => {
  route.push(location);
  updateMapPolyline(route);
  updateStats(location.speed, route.length);
});

BackgroundLocation.addListener('onHeartbeat', (event) => {
  if (event.location) {
    updateStationaryIndicator(event.location);
  }
});

await BackgroundLocation.start();

// When workout ends:
// await BackgroundLocation.stop();
// saveRoute(route);`}
        </pre>
      </div>

      {/* Geofencing */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">Geofencing — Points of Interest</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor up to 20 circular regions. Works even when the app is
          terminated.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`import { BackgroundLocation } from 'capacitor-bglocation';

// Configure first (required before geofencing)
await BackgroundLocation.configure({
  distanceFilter: 50,
  desiredAccuracy: 'balanced',
  heartbeatInterval: 60,
  locationUpdateInterval: 10000,
  fastestLocationUpdateInterval: 5000,
});

// Add geofences
await BackgroundLocation.addGeofence({
  identifier: 'office',
  latitude: 52.2297,
  longitude: 21.0122,
  radius: 100,
  notifyOnEntry: true,
  notifyOnExit: true,
});

// Listen for transitions
BackgroundLocation.addListener('onGeofence', (event) => {
  console.log(event.identifier, event.action);
  // 'office', 'enter' | 'exit' | 'dwell'
  
  if (event.action === 'enter') {
    showNotification('Arrived at office');
  }
});

await BackgroundLocation.start();`}
        </pre>
      </div>
    </section>
  );
}
