---
title: "Building a Production-Ready Background Location Plugin for Capacitor & React Native"
slug: "building-production-ready-background-location-plugin"
description: "How we built a background GPS tracking plugin with native HTTP, offline buffer, heartbeat, geofencing, and 890+ tests — and what we learned along the way."
date: "2026-04-01"
tags: ["capacitor", "react-native", "mobile", "geolocation"]
published: true
author: "Szymon Walczak"
cover_image: null
canonical_url: "https://bglocation.dev/blog/building-production-ready-background-location-plugin"
---

If you've ever tried to track a user's location in the background on iOS or Android, you know the pain. The app gets suspended, GPS stops, and eventually the OS kills your service. And your JavaScript `setInterval` becomes useless the moment the screen turns off.

We spent over a year trying to solve background location with the solutions already available on the market, and eventually decided to build our own. The result is a background location plugin for Capacitor and React Native that actually works in production. Not just a proof of concept or another "works on my simulator" demo. We have created a heavily tested plugin with native HTTP posting, offline buffering, and a licensing model that doesn't lock you into another monthly bill. Here's what we learned.

## The Problem

Every team building a delivery app, fleet tracker, or fitness app hits the same wall: **background location on mobile is brutally hard**.

The official plugins (`@capacitor/geolocation`, `expo-location`) work great in the foreground. But the moment your app goes to the background:

- **iOS** aggressively suspends your app within seconds
- **Android** OEMs (Xiaomi, Huawei, Samsung) have custom battery optimizations that kill background services
- JavaScript timers **stop working** as there's no `setInterval` in the graveyard of suspended processes
- Location updates become sporadic, delayed, or simply stop

You end up stitching together 3-4 packages, writing native code, and praying it survives a weekend in production.

## Our Approach: Native-First, Framework-Agnostic Core

Instead of writing JavaScript that calls native APIs, we built the core logic **entirely in native code** (Swift for iOS, Kotlin for Android) and kept the JS layer as a thin bridge.

The architecture has three layers:

```
┌─────────────────────────────────┐
│  JS Bridge (Capacitor / RN)     │  ← Framework-specific, thin
├─────────────────────────────────┤
│  Native Managers & Services     │  ← CLLocationManager / FusedLocation
├─────────────────────────────────┤
│  Shared Native Core             │  ← Framework-agnostic business logic
└─────────────────────────────────┘
```

Both the Capacitor and React Native plugins share the same native core. A bug fix in the core propagates to both frameworks automatically. No drift.

## Making iOS Actually Track in the Background

iOS is the stricter platform. Apple is *very* aggressive about killing background processes. Here's what we do:

### 1. Correct Background Configuration

The default `CLLocationManager` settings actively work against background tracking — iOS will "pause" your location updates when it thinks the user stopped moving. Spoiler: it guesses wrong. A lot. We ship a carefully tuned configuration that keeps updates flowing continuously, including treating your app with navigation-level background priority.

### 2. Automatic Recovery After App Termination

Even with the right config, iOS can still terminate your app under memory pressure. Our plugin **automatically recovers** and restarts fine-grained GPS tracking when the OS wakes the app. From the user's perspective, nothing changes — tracking just keeps working.

### 3. Heartbeat Timer

GPS events only fire when the device moves. But what if the user stops for 20 minutes at a delivery point? Your server has no idea if the app crashed or the driver is waiting.

We fire a **heartbeat event** at a configurable interval (default: 15 seconds) regardless of movement, optimized for minimal battery impact.

```typescript
BackgroundLocation.addListener('onHeartbeat', (event) => {
  console.log('Still alive at:', event.timestamp);
  console.log('Last known position:', event.location);
});
```

## Making Android Survive Battery Killers

Android's challenge is different: it's not just the OS, but the **OEM customizations** layered on top of it.

### 1. Persistent Foreground Service

Our plugin uses a foreground service that the system automatically restarts after an OOM kill. On Android 12+, the notification appears instantly — no 10-second delay that confuses users.

### 2. Battery Optimization Detection

We detect the device manufacturer and warn developers when battery optimization is likely to kill their app:

```typescript
BackgroundLocation.addListener('onBatteryWarning', (event) => {
  // event.manufacturer: "Xiaomi"
  // event.helpUrl: "https://dontkillmyapp.com/xiaomi"
  // event.isIgnoringOptimizations: false
});

// Prompt user to disable optimization
await BackgroundLocation.requestBatteryOptimization();
```

This links directly to [dontkillmyapp.com](https://dontkillmyapp.com) — a community-maintained database of OEM-specific workarounds. Instead of chasing phantom kills, your app can tell the user exactly what to fix.

### 3. Mock Location Detection

For fleet tracking, knowing if someone is faking their GPS is critical:

```typescript
BackgroundLocation.addListener('onLocation', (location) => {
  if (location.isMock) {
    // Flag for review — location may be spoofed
  }
});
```

## Native HTTP: Because JavaScript Can't POST From the Grave

This is perhaps the most underrated feature. Most plugins give you location updates in JavaScript and expect *you* to send them to your server. But when your app is in the background or has been killed, that JavaScript code **isn't running**.

Our plugin handles HTTP natively:

```typescript
await BackgroundLocation.configure({
  distanceFilter: 50,
  http: {
    url: 'https://api.example.com/locations',
    headers: {
      'Authorization': 'Bearer your-token'
    },
    buffer: {
      maxSize: 1000  // SQLite-backed offline queue
    }
  }
});
```

When the device is offline, locations are buffered in a **SQLite database** (up to 1,000 entries by default). When connectivity returns, they're sent automatically with retry logic.

You get feedback via the `onHttp` event:

```typescript
BackgroundLocation.addListener('onHttp', (response) => {
  console.log(`Status: ${response.statusCode}`);
  console.log(`Buffered: ${response.bufferedCount}`);
  if (!response.success) {
    console.log(`Error: ${response.error}`);
  }
});
```

No extra HTTP library. No separate background task scheduler. It just works.

## Adaptive Distance Filter

Static distance filters are a trade-off: too small means battery drain, and too large means missed data points.

We built an **adaptive mode** that automatically adjusts based on speed:

```typescript
await BackgroundLocation.configure({
  distanceFilter: 'auto',
  autoDistanceFilter: {
    targetInterval: 10,   // seconds between updates
    minDistance: 10,       // meters
    maxDistance: 500       // meters
  }
});
```

The algorithm reacts faster to deceleration than acceleration — because when a driver slows down near a destination, you need precision *now*, not after three more GPS fixes. In practice: highway driving → large filter (saving battery) → approaching a destination → filter drops rapidly for precise tracking.

## Geofencing: Built-In, Not Bolted On

You can monitor up to 20 geofence regions natively, even when the app is killed:

```typescript
await BackgroundLocation.addGeofence({
  identifier: 'warehouse-a',
  latitude: 52.2297,
  longitude: 21.0122,
  radius: 200,
  notifyOnEntry: true,
  notifyOnExit: true,
  notifyOnDwell: true,
  dwellDelay: 30000 // 30 seconds
});

BackgroundLocation.addListener('onGeofence', (event) => {
  console.log(`${event.action} ${event.identifier}`);
  // "enter warehouse-a" / "dwell warehouse-a" / "exit warehouse-a"
});
```

On iOS this uses `CLCircularRegion` (persisted across app restarts by the OS). On Android, `GeofencingClient` with a `BroadcastReceiver`. Same API, same behavior.

## Testing: 890+ Automated Tests

We do not treat "it works on my phone" as a test strategy. The plugin has **890+ automated tests** across iOS, Android, web, and the test app:

| Layer | Count | Framework |
|-------|-------|-----------|
| iOS native | 267 | XCTest (SPM) |
| Android native | 343 | JUnit 5 + MockK |
| Web fallback | 164 | Vitest |
| Test app | 116 | Vitest + Playwright |

Plus **567 additional tests** in the shared native core library (245 XCTest + 322 JUnit).

The three-layer architecture makes this possible: pure helper classes and models have zero platform dependencies — they're fully testable on JVM and SPM without simulators or devices.

## The Licensing Model

We chose a **perpetual license** — you buy once, and you use it forever. No recurring invoice just to keep your fleet tracking app running.

- **$199** (Indie) — 1 app
- **$399** (Team) — up to 5 apps
- **$499** (Factory) — up to 20 apps

Each license includes 1 year of updates. After that, your version keeps working — you just don't get new releases unless you renew.

No API key to validate against a server. No phone-home checks. The license is validated entirely offline — it works in airplane mode, in tunnels, everywhere.

**There's a full trial mode** — 30-minute sessions with all features, no credit card, no license key. Install and go:

```bash
npm install @bglocation/capacitor
# or
npm install @bglocation/react-native
```

## Getting Started

Here's a minimal working example:

```typescript
import { BackgroundLocation } from '@bglocation/capacitor';

// 1. Request permissions
await BackgroundLocation.requestPermissions({
  permissions: ['location']
});
await BackgroundLocation.requestPermissions({
  permissions: ['backgroundLocation']
});

// 2. Configure
await BackgroundLocation.configure({
  distanceFilter: 50,
  heartbeatInterval: 15,
  debug: true
});

// 3. Listen for events
BackgroundLocation.addListener('onLocation', (location) => {
  console.log(`${location.latitude}, ${location.longitude}`);
});

// 4. Start tracking
await BackgroundLocation.start();
```

That's it: background tracking, heartbeat, and debug logging in about 10 lines.

## What's Next

The React Native port (`@bglocation/react-native`) uses TurboModules and supports both Expo and bare React Native. Same native core, same features, same API. One license covers both frameworks (tied to bundle ID, not framework).

We're working on documentation, more tutorials, and — if there's demand — Flutter support.

If you're building something that needs reliable background GPS tracking, **give the trial a spin**. No key needed, all features included, 30 minutes per session.

- **Website & Docs**: [bglocation.dev](https://bglocation.dev)
- **npm (Capacitor)**: `@bglocation/capacitor`
- **npm (React Native)**: `@bglocation/react-native`

---

*Have questions or feedback? Drop a comment below or reach out at hello@bglocation.dev.*
