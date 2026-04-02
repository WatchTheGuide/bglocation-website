---
title: "Setting Up Geofencing in a Mobile App"
slug: "setting-up-geofencing-in-a-mobile-app"
description: "A practical guide to implementing geofencing in Capacitor and React Native apps. Learn how to define regions, handle enter/exit/dwell events, and deal with iOS vs Android differences."
date: "2026-04-02"
tags: ["geofencing", "capacitor", "react-native", "mobile", "location"]
published: true
author: "Szymon Walczak"
cover_image: null
canonical_url: "https://bglocation.dev/blog/setting-up-geofencing-in-a-mobile-app"
---

Geofencing lets your app react when a user enters or leaves a geographic area. Think delivery notifications ("Your driver is nearby"), attendance systems, location-based reminders, or smart home automation that turns on the lights when you arrive.

Sounds simple. The reality? iOS and Android handle geofencing very differently under the hood, dwell detection is platform-specific, and your app might be suspended or killed before a transition fires.

This guide walks through implementing geofencing in a Capacitor or React Native app using the **bglocation** plugin — from defining your first region to handling edge cases in production.

## What is Geofencing?

A geofence is a virtual boundary around a geographic point. You define a center (latitude, longitude) and a radius in meters. The OS monitors the device's position and triggers events when the user:

- **Enters** the region
- **Exits** the region
- **Dwells** inside the region for a specified time

Unlike continuous GPS tracking, geofencing is power-efficient. The OS uses a combination of cell towers, Wi-Fi, and GPS to determine transitions — your app doesn't need to poll location constantly.

## Prerequisites

Install the bglocation plugin in your project:

```bash
# Capacitor
npm install @bglocation/capacitor
npx cap sync

# React Native
npm install @bglocation/react-native
cd ios && pod install
```

## Defining a Geofence

Each geofence has an `identifier`, coordinates, and a `radius`:

```typescript
import { BackgroundLocation } from '@bglocation/capacitor';
// or: import { BGLocation } from '@bglocation/react-native';

// Always call configure() first — the plugin rejects geofence calls without it
await BackgroundLocation.configure({
  debug: true,
});

await BackgroundLocation.addGeofence({
  identifier: 'office',
  latitude: 52.2297,
  longitude: 21.0122,
  radius: 200,
  notifyOnEntry: true,
  notifyOnExit: true,
});
```

There are a few rules that we should follow:

- **`identifier`** must be unique. Adding a geofence with an existing identifier replaces it.
- **`radius`** is in meters. Use at least **100 meters** for reliable detection — smaller radii lead to inconsistent triggers, especially on Android.
- The plugin supports up to **20 simultaneous geofences** (matching the iOS platform limit).

## Listening for Events

Register a listener before adding geofences:

```typescript
BackgroundLocation.addListener('onGeofence', (event) => {
  console.log(`${event.action}: ${event.identifier}`);

  // GPS coordinates at the moment of transition
  if (event.location) {
    console.log(`${event.location.latitude}, ${event.location.longitude}`);
  }

  // Custom metadata you attached to the geofence
  if (event.extras) {
    console.log('Metadata:', event.extras);
  }
});
```

The `GeofenceEvent` includes:

| Field | Type | Description |
|-------|------|-------------|
| `identifier` | `string` | Which geofence was triggered |
| `action` | `'enter' \| 'exit' \| 'dwell'` | Transition type |
| `location` | `Location \| null` | GPS position at transition |
| `extras` | `Record<string, string>` | Your custom metadata |
| `timestamp` | `number` | Epoch milliseconds |

## Adding Multiple Geofences

If you need to register several regions at once, use the batch API:

```typescript
await BackgroundLocation.addGeofences({
  geofences: [
    {
      identifier: 'office',
      latitude: 52.2297,
      longitude: 21.0122,
      radius: 200,
      notifyOnEntry: true,
      notifyOnExit: true,
    },
    {
      identifier: 'warehouse',
      latitude: 52.2450,
      longitude: 21.0350,
      radius: 300,
      notifyOnEntry: true,
      notifyOnExit: false,
      extras: { type: 'pickup-point' },
    },
    {
      identifier: 'client-site',
      latitude: 52.1900,
      longitude: 20.9800,
      radius: 150,
      notifyOnEntry: true,
      notifyOnDwell: true,
      dwellDelay: 300, // 5 minutes
      extras: { clientId: '42', priority: 'high' },
    },
  ],
});
```

The batch operation is **atomic** — if adding the batch would exceed the 20-geofence limit, all of them are rejected. No partial state.

## Dwell Detection — The Tricky Part

Dwell events fire when a user stays inside a geofence for a specified duration. This is useful for attendance tracking ("employee arrived and stayed for 5+ minutes") or visit confirmation.

```typescript
await BackgroundLocation.addGeofence({
  identifier: 'store-visit',
  latitude: 52.2297,
  longitude: 21.0122,
  radius: 200,
  notifyOnEntry: true,
  notifyOnDwell: true,
  dwellDelay: 300, // seconds (5 minutes)
});
```

Here's the catch: **iOS and Android handle dwell completely differently**.

### Android

Android's `GeofencingClient` supports dwell natively. It works reliably even when the app is terminated. Set it and forget it.

### iOS

iOS has no native dwell API. The plugin implements it using an internal timer:

1. User enters the geofence → timer starts for `dwellDelay` seconds
2. Timer expires → `dwell` event emitted
3. User exits before timer expires → timer cancelled

The important caveat: if iOS kills your app before the timer fires, the dwell event is emitted **retroactively** on the next app launch — not in real-time. The plugin persists the entry timestamp internally and checks it when the app restarts.

For most use cases (visit logs, analytics), retroactive dwell is fine. For real-time alerts ("user has been on-site for 5 minutes"), keep this limitation in mind.

## Managing Geofences

### Check registered geofences

```typescript
const { geofences } = await BackgroundLocation.getGeofences();
console.log(`Active geofences: ${geofences.length}`);
geofences.forEach(g => console.log(`  ${g.identifier} (${g.radius}m)`));
```

### Remove a specific geofence

```typescript
await BackgroundLocation.removeGeofence({ identifier: 'office' });
```

Removing a non-existent geofence is a no-op — no error thrown.

### Remove all geofences

```typescript
await BackgroundLocation.removeAllGeofences();
```

## Attaching Metadata with Extras

The `extras` field lets you attach key-value metadata to a geofence that gets included in every event:

```typescript
await BackgroundLocation.addGeofence({
  identifier: 'delivery-zone-7',
  latitude: 52.2100,
  longitude: 21.0200,
  radius: 250,
  notifyOnEntry: true,
  extras: {
    zoneId: '7',
    zoneName: 'Downtown Warsaw',
    priority: 'high',
  },
});

// Later, in the event handler:
BackgroundLocation.addListener('onGeofence', (event) => {
  if (event.action === 'enter' && event.extras?.priority === 'high') {
    sendPushNotification(`Driver entered high-priority zone: ${event.extras.zoneName}`);
  }
});
```

All `extras` values must be strings. If you need numbers or objects, serialize them.

## iOS vs Android: What You Need to Know

| Aspect | iOS | Android |
|--------|-----|---------|
| **Max geofences** | 20 (CLLocationManager limit) | 20 (plugin-enforced, matching iOS) |
| **Dwell support** | Timer-based (plugin) | Native (GeofencingClient) |
| **Survives app kill** | Yes (region monitoring persists) | Yes, but **not device reboot** |
| **Minimum radius** | ~100m recommended | ~100m recommended |
| **Detection method** | Cell + Wi-Fi + GPS | Cell + Wi-Fi + GPS |

### Device Reboot

On **iOS**, geofence registrations survive device reboots — the OS re-registers them automatically.

On **Android**, geofences are cleared on reboot. The plugin re-registers them automatically when `configure()` is called (typically on app launch). Make sure you call `configure()` early in your app lifecycle.

## Debug Mode

Enable debug mode to see geofence operations in real time:

```typescript
await BackgroundLocation.configure({
  debug: true,
  debugSounds: true,
});
```

You'll see log messages like:

```
GEOFENCE ADD office
GEOFENCE ENTER office
GEOFENCE DWELL office
GEOFENCE EXIT office
GEOFENCE REMOVE office
```

With `debugSounds: true`, you'll also hear system sounds on geofence add and transition events — useful for testing in the field without staring at the console.

## Production Tips

### 1. Don't use tiny radii

A 50-meter geofence sounds precise, but GPS accuracy varies by 5–30 meters depending on conditions. Use **100m minimum** for consistent results. In urban areas with tall buildings, consider 150–200m.

### 2. Rotate geofences dynamically

With a 20-geofence limit, you can't monitor hundreds of locations simultaneously. Instead, use background location tracking to detect which geofences are nearby, and swap them in and out dynamically.

### 3. Handle the 20-geofence limit gracefully

```typescript
const { geofences } = await BackgroundLocation.getGeofences();
if (geofences.length >= 20) {
  // Remove the least relevant geofence before adding a new one
  await BackgroundLocation.removeGeofence({
    identifier: findLeastRelevant(geofences),
  });
}
await BackgroundLocation.addGeofence(newGeofence);
```

### 4. Always re-register on app launch

Call `configure()` on every app start. This ensures geofences are re-registered on Android after a device reboot and that the plugin state is consistent.

### 5. Combine with HTTP posting

The bglocation plugin includes native HTTP posting with offline buffer. You can use both features together — track locations continuously and get instant notifications when users enter specific zones, all with a single plugin:

```typescript
await BackgroundLocation.configure({
  distanceFilter: 50,
  http: {
    url: 'https://api.example.com/locations',
    headers: { Authorization: 'Bearer token' },
  },
});

await BackgroundLocation.start();

await BackgroundLocation.addGeofence({
  identifier: 'destination',
  latitude: 52.2297,
  longitude: 21.0122,
  radius: 200,
  notifyOnEntry: true,
});
```

## Trial Mode

You can test geofencing without a license key. The plugin's trial mode gives you **30 minutes of full functionality** — including geofencing. After the trial expires, there's a 1-hour cooldown before the next session.

Adding a geofence activates the trial timer (same as `start()`). On trial expiry, all geofences are automatically removed.

## Summary

Geofencing is a powerful tool for location-aware apps, but the devil is in the platform details. The bglocation plugin abstracts the iOS/Android differences behind a single API while giving you the control you need for production use.

Key takeaways:

- Use **100m+ radii** for reliable detection
- Handle the **20-geofence limit** with dynamic rotation
- Be aware that **dwell on iOS** is timer-based and retroactive after app termination
- **Re-register geofences** on Android after reboot by calling `configure()` on launch
- Use **extras** to attach business logic metadata to geofence events
- Test with **debug mode** and **trial mode** before buying a license

Ready to add geofencing to your app? Check the [geofencing documentation](/docs/geofencing) or install the plugin and try the 30-minute trial.
