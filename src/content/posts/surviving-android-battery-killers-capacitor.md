---
title: "Surviving Android Battery Killers in Capacitor Apps"
slug: "surviving-android-battery-killers-capacitor"
description: "Why your background location tracking dies on Xiaomi, Samsung, and Huawei — and how to detect, prevent, and guide users through OEM battery restrictions in a Capacitor app."
date: "2026-04-20"
tags: ["capacitor", "android", "battery", "location", "mobile", "performance"]
published: true
author: "Szymon Walczak"
cover_image: null
canonical_url: "https://bglocation.dev/blog/surviving-android-battery-killers-capacitor"
---

## "Works on My Emulator"

You've built background location tracking for your Capacitor app. It works flawlessly on your Pixel. It works on the emulator. You ship it.

Then the bug reports start pouring in. "Tracking stops after a few minutes." "The app dies when I lock my phone." "It worked yesterday but not today."

Welcome to the world of Android OEM battery killers — where manufacturers like Xiaomi, Samsung, Huawei, and Oppo add aggressive power management layers on top of stock Android. These proprietary systems kill background services, restrict autostart, and put apps to sleep — all without telling the user or the developer.

This isn't a bug in your code. It's a feature of the phone.

## The Problem: It's Not Android, It's the OEM

Stock Android (AOSP) already has battery optimization, but it's relatively predictable. Google's Doze mode, App Standby, and Adaptive Battery follow documented rules. A properly configured foreground service survives all of them.

OEM skins are a different story:

| Manufacturer | Skin | Aggressive Behaviors |
|---|---|---|
| **Xiaomi** | MIUI / HyperOS | Autostart denied by default, "Battery Saver" kills services aggressively, app-level restrictions hidden in Settings |
| **Samsung** | One UI | "Sleeping apps" and "Deep sleeping apps" lists, automatic background restrictions after 3 days of inactivity |
| **Huawei** | EMUI / HarmonyOS | "App launch management" with auto-managed mode, blocks autostart and background activity by default |
| **Oppo / OnePlus** | ColorOS / OxygenOS | "Auto-optimize" kills background services, restricts apps that aren't "protected" |
| **Vivo** | Funtouch OS | Background power consumption limits, auto-cleanup of inactive apps |

These restrictions operate at a system level, below what the Android API exposes. Your foreground service notification is showing, your code is correct, but the OEM decided your app doesn't need to run.

The community at [dontkillmyapp.com](https://dontkillmyapp.com) maintains a scorecard. Xiaomi and Samsung consistently rank among the worst offenders.

## How OEMs Kill Your Tracking

There are three main mechanisms:

### 1. Autostart Restrictions

On Xiaomi and Huawei, apps need explicit "autostart" permission to run after boot or restart background work. This permission is **off by default** for third-party apps. Without it, your foreground service won't restart after the system kills it.

### 2. App Sleep / Deep Sleep

Samsung's One UI puts apps into "sleeping" or "deep sleeping" categories based on usage patterns. A deep sleeping app can't run in the background at all — its services are killed, alarms are deferred, and network access is blocked.

### 3. Aggressive Task Killers

Some OEMs (Oppo, Vivo) run periodic cleanup sweeps that kill background processes regardless of foreground service status. The user sees no indication that this happened.

The result? Your app stops sending location data. The user thinks it's broken. Your support inbox fills up.

## Detecting Battery Restrictions

The `@bglocation/capacitor` plugin detects these OEM restrictions automatically. When you call `start()`, the plugin checks whether battery optimization is active and emits an event if it is:

```typescript
import { BackgroundLocation } from '@bglocation/capacitor';

BackgroundLocation.addListener('onBatteryWarning', (event) => {
  console.warn(event.message);
  console.log('Manufacturer:', event.manufacturer);
  console.log('Ignoring optimizations:', event.isIgnoringOptimizations);
  console.log('Help URL:', event.helpUrl);
});
```

The `onBatteryWarning` event fires on `start()` if the device has active battery optimization that may interfere with tracking. The event includes:

- **`isIgnoringOptimizations`** — `false` means the app is at risk of being killed
- **`manufacturer`** — the device manufacturer in lowercase (e.g., `'xiaomi'`, `'samsung'`)
- **`helpUrl`** — a direct link to [dontkillmyapp.com](https://dontkillmyapp.com) with OEM-specific instructions
- **`message`** — a human-readable warning

You can also check the state manually at any time:

```typescript
const status = await BackgroundLocation.checkBatteryOptimization();

if (!status.isIgnoringOptimizations) {
  // The app is NOT exempt — tracking may be killed
  console.warn(status.message);
}
```

This is useful for showing a status indicator in your UI, or for pre-flight checks before starting a tracking session.

## Prompting the User

Once you've detected that battery optimization is active, the next step is asking the user to disable it. The plugin provides a one-liner for this:

```typescript
await BackgroundLocation.requestBatteryOptimization();
```

This opens the system's battery optimization settings directly for your app. On stock Android, it shows a dialog asking "Allow app to run in the background?" On OEM devices, it opens the closest equivalent settings screen.

**Important**: The result returned by `requestBatteryOptimization()` reflects the state *before* the user interacts with the dialog. After the user returns to your app, call `checkBatteryOptimization()` again to get the updated state:

```typescript
// Show explanation to the user first, then:
await BackgroundLocation.requestBatteryOptimization();

// After user returns to the app:
const updated = await BackgroundLocation.checkBatteryOptimization();
if (updated.isIgnoringOptimizations) {
  console.log('Battery optimization disabled — tracking is safe');
}
```

## Linking to dontkillmyapp.com

The system-level exemption helps, but on many OEM devices it's not enough. Xiaomi's MIUI has *additional* restrictions beyond the standard Android battery optimization — autostart permission, MIUI-specific battery saver, and app pinning.

That's where the `helpUrl` from the `onBatteryWarning` event comes in. It links directly to the device-specific page on [dontkillmyapp.com](https://dontkillmyapp.com) — a community-maintained database of OEM-specific workarounds.

Here's a practical pattern — detect the restriction and show a guided message:

```typescript
import { BackgroundLocation } from '@bglocation/capacitor';
import { Browser } from '@capacitor/browser';

BackgroundLocation.addListener('onBatteryWarning', async (event) => {
  if (event.isIgnoringOptimizations) return;

  // Show a user-friendly explanation
  const shouldOpen = confirm(
    `Your ${event.manufacturer} device may stop location tracking ` +
    `in the background. Would you like to see how to fix this?`
  );

  if (shouldOpen && event.helpUrl) {
    await Browser.open({ url: event.helpUrl });
  }
});
```

Instead of a generic "please disable battery optimization" message, you can tell the user: "Your Xiaomi device requires an additional setting. Here's exactly what to change."

## Customizing the Foreground Notification

On Android 8+, background location tracking runs inside a foreground service with a persistent notification. This notification is what tells the OS "this app is actively doing work — don't kill it."

The plugin lets you customize the notification title and text:

```typescript
await BackgroundLocation.configure({
  distanceFilter: 15,
  notification: {
    title: 'Delivery Active',
    text: 'Tracking your route',
  },
});
```

Default values are "Background Location" and "Tracking your location". You can localize these for your users:

```typescript
await BackgroundLocation.configure({
  notification: {
    title: t('notification.title'),   // i18n
    text: t('notification.text'),
  },
});
```

A clear, non-alarming notification reduces the chance of users force-stopping your app — which is another common reason tracking dies.

## The Complete Flow

Here's how to put it all together — a pre-flight check that runs before you start tracking:

```typescript
import { BackgroundLocation } from '@bglocation/capacitor';

async function startTracking() {
  // 1. Check permissions (see our permissions guide)
  const perms = await BackgroundLocation.checkPermissions();
  if (perms.backgroundLocation !== 'granted') {
    // Handle permissions first
    return;
  }

  // 2. Check battery optimization
  const battery = await BackgroundLocation.checkBatteryOptimization();
  if (!battery.isIgnoringOptimizations) {
    // Show explanation to user, then:
    await BackgroundLocation.requestBatteryOptimization();
  }

  // 3. Listen for ongoing warnings
  BackgroundLocation.addListener('onBatteryWarning', (event) => {
    // Log or show UI warning
    console.warn('Battery restriction:', event.message);
  });

  // 4. Configure and start
  await BackgroundLocation.configure({
    distanceFilter: 15,
    notification: {
      title: 'Delivery Active',
      text: 'Tracking your route',
    },
  });

  await BackgroundLocation.start();
}
```

## Production Checklist

Before releasing your Capacitor app with background location tracking on Android:

- [ ] **Listen for `onBatteryWarning`** — don't ignore it; show users what to do
- [ ] **Call `checkBatteryOptimization()` on app start** — detect restrictions early
- [ ] **Provide a direct link to OEM instructions** — use the `helpUrl` from the event
- [ ] **Customize the notification** — a clear title reduces force-stops
- [ ] **Test on real OEM devices** — Pixel and emulator are not enough; test on Xiaomi, Samsung, and Huawei
- [ ] **Don't request exemption without explanation** — Google Play policy requires a clear rationale for battery optimization exemptions
- [ ] **Handle the "it worked yesterday" scenario** — Samsung's sleeping apps list changes over time; re-check on each session start

## What About iOS?

iOS doesn't have OEM battery killers. Apple controls both the hardware and the software, so background location behavior is consistent across all iPhones.

iOS has its own challenges — the "blue pill" indicator, approximate location permission (iOS 14+), and strict App Store review for background location usage — but the OS won't silently kill a properly authorized tracking session.

The `onBatteryWarning` event and battery optimization methods are Android-only. On iOS, `checkBatteryOptimization()` returns `{ isIgnoringOptimizations: true }` and `requestBatteryOptimization()` is a no-op. You don't need to handle them on iOS.

## Key Takeaways

1. **It's not your code** — OEM battery killers operate below the Android API surface. A working foreground service isn't enough on many devices.
2. **Detect, don't guess** — use `onBatteryWarning` and `checkBatteryOptimization()` to know exactly which devices are at risk.
3. **Guide, don't blame** — link users to device-specific instructions on dontkillmyapp.com instead of a generic "disable battery optimization" message.
4. **Test on real hardware** — the emulator and Pixel don't reproduce OEM restrictions. Test on at least Xiaomi, Samsung, and Huawei before shipping.
5. **Customize the notification** — a clear, branded notification reduces the chance of users killing your app manually.

Android battery killers are the single biggest reason background location tracking fails in production. But with proper detection, user guidance, and testing on real devices, your Capacitor app can survive them.
