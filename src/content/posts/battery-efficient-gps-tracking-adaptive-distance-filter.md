---
title: "Battery-Efficient GPS Tracking in Mobile Apps — How Adaptive Distance Filter Works"
slug: "battery-efficient-gps-tracking-adaptive-distance-filter"
description: "GPS tracking drains battery fast. Learn how an adaptive distance filter adjusts precision based on speed — saving power on highways and delivering accuracy on foot."
date: "2026-04-03"
tags: ["gps", "battery", "capacitor", "react-native", "mobile", "location", "performance"]
published: true
author: "Szymon Walczak"
cover_image: null
canonical_url: "https://bglocation.dev/blog/battery-efficient-gps-tracking-adaptive-distance-filter"
---

Continuous GPS tracking kills battery. A typical 1 Hz GPS session (one fix per second) burns through 10–15% of battery per hour. For an 8-hour delivery shift or a full-day hike, that's a dead phone before the day is over.

Most location plugins give you one knob to tune: the **distance filter** — the minimum distance in meters between location updates. Set it low (10m) and you get precise tracking but aggressive battery drain. Set it high (500m) and battery lasts, but you lose detail around turns, stops, and slow-speed movement.

What if the filter adjusted itself — tight when you're walking, loose when you're on a highway? That's what the adaptive distance filter in the **bglocation** plugin does. This article explains how it works, how to configure it, and what kind of battery savings you can expect in production.

## The Problem with Fixed Distance Filters

A distance filter tells the OS: "don't wake me up until the device has moved at least X meters." It's the primary lever for controlling the trade-off between GPS accuracy and battery life.

Here's the dilemma with a fixed value:

### Too small (e.g., 10–15m)

- GPS hardware stays active almost constantly
- Perfect for recording a walking route on a map
- Terrible for a delivery driver's 8-hour shift — battery won't survive

### Too large (e.g., 300–500m)

- GPS can sleep between fixes — great for battery
- But you miss turns, stops at traffic lights, and any slow-speed detail
- A courier walking to a building entrance? Invisible until they've moved 500m

### The "just right" problem

There is no single distance filter that works well for all movement speeds. A courier's day involves highway driving, city streets, walking between buildings, and standing still at a door. Each phase needs different precision. You could change the filter manually based on some heuristic — but then you're reimplementing something the plugin should handle for you.

## How The Adaptive Distance Filter Works

The **bglocation** plugin includes an auto mode that adjusts the distance filter dynamically based on the device's current speed. The algorithm follows a simple principle:

> **Maintain a consistent time interval between location updates, regardless of speed.**

Instead of "give me an update every 15 meters," you're saying "give me an update roughly every 10 seconds." The plugin translates that into a distance filter based on how fast the device is moving.

### What this looks like in practice

| Activity | Speed | effectiveDistance | Update frequency |
|----------|-------|-------------------|-------------------|
| Standing still | 0 km/h | 10m (minDistance) | Heartbeats only |
| Walking | 5 km/h | ~14m | Every ~10 seconds |
| Jogging | 10 km/h | ~28m | Every ~10 seconds |
| City driving | 40 km/h | ~111m | Every ~10 seconds |
| Highway | 120 km/h | ~333m | Every ~10 seconds |
| Fast highway | 180+ km/h | 500m (maxDistance) | Every ~10 seconds |

The update frequency stays roughly constant — the filter adjusts to match. At highway speed, the GPS hardware can sleep for longer stretches. At walking speed, it stays precise.

### Smart speed response

The filter doesn't treat all speed changes equally:

- **Slowing down** — the filter tightens quickly, giving you precision right when you need it (approaching a destination, parking, exiting a vehicle)
- **Speeding up** — the filter relaxes gradually, since fast movement on predictable roads doesn't need instant fine-tuning

This means you get accurate tracking exactly when it matters most — during the last-mile approach — without wasting battery on unnecessary updates at highway speed.

## Configuration

Enable auto mode by setting `distanceFilter` to `'auto'`:

```typescript
import { BackgroundLocation } from '@bglocation/capacitor';
// or: import { BGLocation } from '@bglocation/react-native';

await BackgroundLocation.configure({
  distanceFilter: 'auto',
});
```

That's it. The defaults (`targetInterval: 10`, `minDistance: 10`, `maxDistance: 500`) work well for most use cases — especially mixed-mode scenarios like delivery or field service.

### Customizing the thresholds

For specific use cases, override the defaults:

```typescript
// High-precision fitness tracking
await BackgroundLocation.configure({
  distanceFilter: 'auto',
  autoDistanceFilter: {
    targetInterval: 8,    // more frequent updates
    minDistance: 5,        // finer detail when slow
    maxDistance: 200,      // cap for road cycling
  },
});

// Long-haul fleet tracking (battery priority)
await BackgroundLocation.configure({
  distanceFilter: 'auto',
  autoDistanceFilter: {
    targetInterval: 15,   // less frequent
    minDistance: 20,       // coarser detail when slow
    maxDistance: 1000,     // very relaxed at highway speed
  },
});
```

### Recommended settings by use case

| Use Case | targetInterval | minDistance | maxDistance | Notes |
|----------|---------------|------------|------------|-------|
| Walking / Hiking | 8–12s | 5–10m | 100–200m | Frequent updates at low speed |
| Cycling | 8–10s | 10–15m | 300m | Balanced for moderate speeds |
| Driving / Fleet | 10–15s | 10–20m | 500–1000m | Larger max for highways, less drain |
| Delivery / Mixed | 10s | 10m | 500m | Defaults work well here |

### Verifying the active mode

`configure()` returns a result that includes which mode is active:

```typescript
const result = await BackgroundLocation.configure({
  distanceFilter: 'auto',
});

console.log(result.distanceFilterMode); // 'auto' or 'fixed'
```

### Inspecting the current filter

Every `Location` object in auto mode includes the current effective distance filter:

```typescript
BackgroundLocation.addListener('onLocation', (location) => {
  console.log(`Speed: ${(location.speed * 3.6).toFixed(1)} km/h`);
  console.log(`Filter: ${location.effectiveDistanceFilter}m`);
});
```

This field is only present when `distanceFilter` is set to `'auto'`. In fixed mode, it's `undefined`.

## Real-World Battery Impact

Let's compare three configurations over an 8-hour delivery shift with mixed driving and walking:

### Fixed 15m filter

- GPS stays highly active throughout the day
- ~2,000+ location points recorded
- Battery impact: **~40–50%** over 8 hours
- Detail: excellent everywhere, but mostly wasted on highways

### Fixed 200m filter

- GPS sleeps frequently but misses detail
- ~300–500 location points recorded
- Battery impact: **~10–15%** over 8 hours
- Detail: good for general route, poor for last-mile walking

### Auto mode (defaults)

- GPS adapts dynamically — tight on foot, relaxed on the road
- ~800–1,200 location points recorded
- Battery impact: **~15–20%** over 8 hours
- Detail: precise when it matters (stops, walking), efficient when it doesn't (highway)

The auto mode doesn't match the battery efficiency of a 200m fixed filter — it can't, because it's doing more work at low speeds. But it's **dramatically** better than a 15m fixed filter while capturing meaningful detail that the 200m filter misses entirely.

> **Note:** Battery figures are approximate, based on internal testing across multiple iOS and Android devices. Actual results vary depending on device model, OS version, signal conditions, and other apps running in the background.

### Fewer points = less data

The filter doesn't just save battery. Fewer location updates mean:

- **Less data transferred** — fewer HTTP POST requests to your server
- **Less storage** — smaller database, faster queries
- **Lower bandwidth costs** — relevant when tracking thousands of devices

## Heartbeat: The Safety Net

There's one scenario the distance filter can't cover: the device is stationary. If a user stops moving, no location events fire regardless of the filter size.

That's where the **heartbeat timer** comes in. The plugin fires `onHeartbeat` events at a fixed interval (default: 15 seconds) even when the device hasn't moved:

```typescript
await BackgroundLocation.configure({
  distanceFilter: 'auto',
  heartbeatInterval: 15, // seconds
});

BackgroundLocation.addListener('onHeartbeat', (event) => {
  console.log('Device alive at:', event.timestamp);

  if (event.location) {
    console.log(`Still at: ${event.location.latitude}, ${event.location.longitude}`);
  }
});
```

The combination of **auto distance filter + heartbeat** gives you:

- Location updates that adapt to speed → battery efficiency
- Regular "alive" signals even when stationary → operational confidence

For fleet management, this means you always know where a vehicle is and that it's still reporting — even if it's been parked for hours.

## When to Use Auto vs Fixed

Auto mode isn't always the right choice. Here's a quick decision guide:

### Use auto when:

- Users switch between transport modes (walking + driving)
- Battery optimization is a priority
- You prefer time-based update intervals over distance-based
- Fleet, delivery, or field service tracking with mixed movement

### Use fixed when:

- Consistent precision matters regardless of speed
- The app targets a single transport mode (e.g., only running)
- You need exact distance-based granularity (every 10m for a running app)
- Fitness tracking where polyline accuracy on a map is critical

You can switch between modes without stopping tracking — `configure()` supports partial reconfiguration:

```typescript
// Start with auto
await BackgroundLocation.configure({ distanceFilter: 'auto' });
await BackgroundLocation.start();

// Later, switch to fixed 10m for a precision phase
await BackgroundLocation.configure({ distanceFilter: 10 });

// Back to auto
await BackgroundLocation.configure({ distanceFilter: 'auto' });
```

## How to Test It

### Trial mode

You can test the adaptive filter without a license key. The plugin's [trial mode](/docs/licensing) gives you full functionality for a generous evaluation period — including auto mode — so you can verify the behavior on a real device before purchasing.

### Debug mode

Enable debug mode to see the filter adapting in real time:

```typescript
await BackgroundLocation.configure({
  distanceFilter: 'auto',
  debug: true,
  debugSounds: true,
});
```

You'll see log messages showing the current speed, effective distance filter, and when recalculations happen. With `debugSounds: true`, you'll hear system sounds on each location update — the frequency of the sounds directly reflects how the filter is behaving.

### Test on a real device

This is important: **don't test adaptive filtering on a simulator**. Simulated location doesn't produce realistic speed values, and the filter won't behave like it does in the real world. Take your phone for a walk, get in a car, and watch the filter adapt.

## Summary

The adaptive distance filter solves a real problem: fixed filters force you to choose between battery life and tracking precision. Auto mode eliminates that trade-off by adjusting the filter based on speed — tight where you need detail, loose where you don't.

Key takeaways:

- Set `distanceFilter: 'auto'` to enable speed-adaptive filtering
- The formula is `speed × targetInterval`, clamped to `[minDistance, maxDistance]`
- Defaults (10s / 10m / 500m) work well for mixed-mode tracking
- The filter responds faster when you slow down — giving precision where it matters most
- Each `Location` includes `effectiveDistanceFilter` so you can see the current value
- Combine with **heartbeat** for stationary detection
- In production, expect significant battery savings compared to a tight fixed filter (results vary by device)

Want to see it in action? Install the plugin, enable debug mode, and go for a drive. The [adaptive filter documentation](/docs/adaptive-filter) has the full configuration reference.

```bash
# Capacitor
npm install @bglocation/capacitor
npx cap sync

# React Native
npm install @bglocation/react-native
cd ios && pod install
```

Try the 30-minute trial — watch the distance filter adapt in real-time as you walk, drive, and stop.

---

*Have questions or feedback? Reach out at hello@bglocation.dev.*
