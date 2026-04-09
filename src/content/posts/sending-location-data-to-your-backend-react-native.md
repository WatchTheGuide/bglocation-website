---
title: "Sending Location Data to Your Backend in React Native — Three Approaches Compared"
slug: "sending-location-data-to-your-backend-react-native"
description: "Compare three ways to send GPS data from a React Native app to your server: native HTTP posting with offline buffer, JS-side fetch, and hybrid. Code examples, trade-offs, and production tips."
date: "2026-04-09"
tags: ["react-native", "http", "backend", "location", "offline", "mobile", "api"]
published: true
author: "Szymon Walczak"
cover_image: null
canonical_url: "https://bglocation.dev/blog/sending-location-data-to-your-backend-react-native"
---

You've got background location tracking working in your React Native app. GPS coordinates are flowing in. Now what? Those coordinates need to reach your server — reliably, even when the user is on a flaky cellular connection, driving through a tunnel, or hasn't opened the app in hours.

This is where most location tracking setups fall apart. Not in getting the GPS fix, but in **getting the data home**. This article compares three approaches to sending location data from a React Native app to your backend, with real code examples using the `@bglocation/react-native` plugin.

## The Challenge

Sending location data sounds simple — it's just an HTTP POST. But in mobile reality:

- The app may be **in the background** when the location arrives — your JS fetch may never execute
- The device may be **offline** — underground, in a warehouse, in a rural area
- The connection may be **unreliable** — switching between WiFi and cellular, high latency
- The OS may **kill your app** at any moment — any data in memory is lost
- You may get **hundreds of updates** in a burst after re-emerging from a dead zone

A production-grade solution needs to handle all of these. Let's look at three approaches.

## Approach 1: Native HTTP Posting (Recommended)

The `@bglocation/react-native` plugin includes a built-in native HTTP client. When you configure an `http` block, the native layer (Swift on iOS, Kotlin on Android) sends each location to your server immediately — bypassing JavaScript entirely.

### Setup

```typescript
import * as BGLocation from '@bglocation/react-native';

await BGLocation.configure({
  distanceFilter: 15,
  http: {
    url: 'https://api.example.com/locations',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json',
    },
  },
});

await BGLocation.start();
```

That's the entire setup. Every location update now triggers a native HTTP POST to your endpoint.

### What gets sent

Each POST contains a single location as JSON:

```json
{
  "latitude": 52.2297,
  "longitude": 21.0122,
  "accuracy": 8.5,
  "altitude": 115.2,
  "altitudeAccuracy": 3.0,
  "speed": 1.4,
  "heading": 185.3,
  "timestamp": 1712678400000,
  "isHeartbeat": false
}
```

### Monitoring delivery

Listen to `onHttp` events for delivery status:

```typescript
BGLocation.addListener('onHttp', (event) => {
  if (event.success) {
    console.log(`✓ Delivered (${event.statusCode})`);
  } else {
    console.log(`✗ Failed: ${event.error ?? `HTTP ${event.statusCode}`}`);
    console.log(`  Buffered: ${event.bufferedCount} locations waiting`);
  }
});
```

### Offline buffer

This is where native HTTP really shines. When the POST fails (no network, server error, timeout), the location is automatically stored in a **native persistent buffer**. When connectivity returns, buffered locations are replayed in order — oldest first — without any JS code running.

Configure the buffer size:

```typescript
await BGLocation.configure({
  http: {
    url: 'https://api.example.com/locations',
    headers: { 'Authorization': 'Bearer YOUR_TOKEN' },
    buffer: {
      maxSize: 2000, // store up to 2000 locations offline
    },
  },
});
```

The default is 1,000 locations. At one update every 15 seconds, that's roughly 4 hours of offline capacity.

### Why this approach wins

| Advantage | Why it matters |
|-----------|---------------|
| **Works in background** | Native code runs even when JS bridge is suspended |
| **Automatic retry** | Failed POSTs are buffered and replayed — zero JS logic needed |
| **Survives app kill** | SQLite buffer persists on disk — data isn't lost |
| **No JS overhead** | Location → HTTP happens entirely in native code |
| **Ordered delivery** | Buffered locations are sent FIFO when connectivity returns |

### When to choose this

- **Fleet tracking** — vehicles go through tunnels, rural zones, parking garages
- **Delivery apps** — couriers move in and out of coverage constantly
- **Field service** — technicians work in basements, warehouses, remote sites
- **Any app where data loss is unacceptable**

## Approach 2: JavaScript-Side Fetch

If you need full control over the request — custom payload format, batching, or integration with an existing API client — you can skip native HTTP and send data from JavaScript.

### Setup

```typescript
import * as BGLocation from '@bglocation/react-native';

// No http config — we handle sending ourselves
await BGLocation.configure({
  distanceFilter: 15,
});

BGLocation.addListener('onLocation', async (location) => {
  try {
    const response = await fetch('https://api.example.com/locations', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: location.latitude,
        lng: location.longitude,
        speed: location.speed,
        ts: location.timestamp,
        device_id: 'device-abc-123',
        trip_id: currentTripId,
      }),
    });

    if (!response.ok) {
      console.error(`Server returned ${response.status}`);
    }
  } catch (error) {
    console.error('Network error:', error);
    // TODO: buffer locally and retry later
  }
});

await BGLocation.start();
```

### The catch

This works fine **in the foreground**. But there are real problems:

1. **Background execution** — on iOS, your JS code may not run when a location arrives in the background. The native layer fires the event, but the JS bridge may be suspended. On Android with a foreground service (which bglocation uses), JS has a better chance of running — but it's not guaranteed.

2. **No automatic retry** — if `fetch` fails, the location is gone unless you build your own queue.

3. **App kill = data loss** — anything in JavaScript memory disappears when the OS terminates the process.

### Making it more resilient

You can add a basic queue using AsyncStorage or MMKV:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'location_queue';

async function enqueue(location: object) {
  const queue = JSON.parse(await AsyncStorage.getItem(QUEUE_KEY) ?? '[]');
  queue.push(location);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

async function flush() {
  const queue = JSON.parse(await AsyncStorage.getItem(QUEUE_KEY) ?? '[]');
  if (queue.length === 0) return;

  try {
    const response = await fetch('https://api.example.com/locations/batch', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locations: queue }),
    });

    if (response.ok) {
      await AsyncStorage.setItem(QUEUE_KEY, '[]');
    }
  } catch {
    // Will retry on next flush
  }
}

BGLocation.addListener('onLocation', async (location) => {
  await enqueue({
    lat: location.latitude,
    lng: location.longitude,
    ts: location.timestamp,
  });
  await flush();
});
```

This adds resilience — but you've just built a basic version of what the native HTTP buffer does automatically. And it still doesn't work reliably in the background on iOS.

### When to choose this

- **Foreground-only tracking** — map display, ride sharing UI active on screen
- **Custom payload format** — your API expects a specific schema, batching, or additional fields
- **Prototyping** — validating a concept before investing in backend integration
- **Web development background** — you're comfortable with fetch and want familiar patterns

## Approach 3: Hybrid — Native HTTP + JS Enrichment

The third approach combines native HTTP for reliable delivery with JS-side processing for additional logic. This is useful when you need to:

- Add client-side computed fields (trip ID, geofence context, user state)
- Filter out unwanted locations before they hit your server
- Send to multiple endpoints

### Setup

```typescript
import * as BGLocation from '@bglocation/react-native';

// Native HTTP handles the primary delivery
await BGLocation.configure({
  distanceFilter: 15,
  http: {
    url: 'https://api.example.com/locations',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
    },
  },
});

// JS listener for secondary processing
BGLocation.addListener('onLocation', (location) => {
  // Update local UI
  updateMapMarker(location.latitude, location.longitude);

  // Analytics or secondary API
  analytics.track('location_update', {
    speed: location.speed,
    accuracy: location.accuracy,
  });
});

// Monitor delivery for debugging
BGLocation.addListener('onHttp', (event) => {
  if (!event.success) {
    reportDeliveryFailure(event);
  }
});

await BGLocation.start();
```

### The key insight

**Native HTTP is the reliable backbone** — it handles delivery, retry, and offline buffering. **JavaScript is the optional enrichment layer** — it processes data opportunistically when the app is active. If the JS bridge is suspended, native HTTP still delivers. You get the best of both worlds.

### Custom headers for context

You can use HTTP headers to pass context that your backend extracts:

```typescript
await BGLocation.configure({
  http: {
    url: 'https://api.example.com/locations',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'X-Device-Id': deviceId,
      'X-Trip-Id': currentTripId,
      'X-Driver-Id': driverId,
    },
  },
});
```

When trip context changes, reconfigure without stopping tracking:

```typescript
// Driver starts a new trip
await BGLocation.configure({
  http: {
    url: 'https://api.example.com/locations',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'X-Trip-Id': newTripId,  // Updated
    },
  },
});
// Tracking continues — no restart needed
```

`configure()` supports partial reconfiguration. Only the fields you pass are updated; the rest are preserved.

### When to choose this

- **Production fleet/delivery apps** — reliable delivery + UI updates + analytics
- **Apps with trip/session context** — you need to tag locations with business data
- **Multi-endpoint scenarios** — primary data goes to your API, secondary to analytics

## Comparison Table

| | Native HTTP | JS Fetch | Hybrid |
|---|---|---|---|
| **Background reliability** | Excellent | Poor (iOS) | Excellent |
| **Offline support** | Built-in native buffer | Manual implementation | Built-in + optional JS |
| **Survives app kill** | Yes (persisted to disk) | No | Yes (native part) |
| **Custom payload format** | Fixed (Location JSON) | Full control | Headers for context |
| **Setup complexity** | Minimal | Moderate | Moderate |
| **Batching** | One-at-a-time | Custom | One-at-a-time + custom |
| **JS bridge dependency** | None | Full | Partial (enrichment only) |

## Backend Side: What to Expect

Regardless of approach, your backend will receive location data. Here are practical tips:

### Idempotency

The same location may be POSTed more than once (retry after timeout where the server actually received it). Use the `timestamp` + device identifier as a natural deduplication key:

```sql
CREATE UNIQUE INDEX idx_location_dedup
ON locations (device_id, timestamp);
```

### Burst handling

When a device comes back online after an offline period, the buffer flushes rapidly. Your endpoint should handle bursts of dozens of POSTs in quick succession. Consider:

- Rate limiting per device (not globally)
- Async processing with a queue (SQS, Redis, Kafka)
- Batch INSERT on the database side

### Timestamp vs server time

Always use the location's `timestamp` field — it's the time of the GPS fix, not the time it arrived at your server. A location from 30 minutes ago (buffered offline) is still valuable for route reconstruction.

### Health monitoring

Use `onHttp` events (or server-side metrics) to track:

- **Delivery success rate** — what percentage of locations arrive on first attempt?
- **Buffer depth** — how many locations are commonly buffered? If it's consistently high, your endpoint may be too slow
- **Latency** — time between `timestamp` and server receipt time

## Getting Started

Install the plugin and start with native HTTP — it's the simplest path to reliable location delivery:

```bash
npm install @bglocation/react-native
cd ios && pod install
```

```typescript
import * as BGLocation from '@bglocation/react-native';

await BGLocation.configure({
  distanceFilter: 'auto',
  http: {
    url: 'https://api.example.com/locations',
    headers: { 'Authorization': 'Bearer YOUR_TOKEN' },
  },
});

await BGLocation.start();
```

The plugin works in [trial mode](/docs/licensing) without a license key — full functionality for evaluation. Test the HTTP delivery on a real device, check the `onHttp` events, pull the network cable (toggle airplane mode), and watch the buffer handle it.

Read the full [HTTP Posting documentation](/docs/http-posting) for advanced configuration and the [API Reference](/docs/api-reference) for all available options.

---

*Questions about backend integration? Reach out at hello@bglocation.dev.*
