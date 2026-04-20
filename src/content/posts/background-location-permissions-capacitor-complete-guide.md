---
title: "Background Location Permissions in Capacitor — The Complete Guide"
slug: "background-location-permissions-capacitor-complete-guide"
description: "A step-by-step guide to requesting background location permissions in Capacitor apps. Two-step Android flow, iOS Always Allow escalation, handling denials, and App Store / Play Store review tips."
date: "2026-04-20"
tags: ["capacitor", "permissions", "location", "ios", "android", "mobile"]
published: true
author: "Szymon Walczak"
cover_image: null
canonical_url: "https://bglocation.dev/blog/background-location-permissions-capacitor-complete-guide"
---

You've integrated a background location plugin, configured the tracking, and everything works on the simulator. Then you install on a real device, tap "Start," and... nothing. No GPS. No events. The plugin silently refuses to track.

Nine times out of ten, it's a permissions issue.

Background location is one of the most heavily restricted capabilities on both iOS and Android. The OS doesn't just ask "Allow location?" — it asks multiple times, in multiple stages, with platform-specific quirks that trip up even experienced mobile developers.

This guide walks through the complete permission flow for background location in a Capacitor app using the `@bglocation/capacitor` plugin: what to configure, how to request permissions correctly, how to handle edge cases like denials and approximate location, and how to pass App Store and Play Store review.

## Why Background Location Permissions Are Different

Foreground location is straightforward. Your app asks, the user taps "Allow," and you start receiving coordinates.

Background location is a different beast entirely. Both Apple and Google treat it as a **sensitive capability** because it has direct privacy implications — an app that tracks location in the background can follow a user 24/7.

As a result:

- **iOS** separates "While Using" from "Always" authorization and auto-escalates through a two-stage system dialog
- **Android 10+** requires background location as a **separate permission request** from foreground location
- **Android 11+** adds a mandatory in-app rationale step before showing the system dialog
- Both platforms can **silently downgrade** your permission if the user revokes it from Settings
- Play Store requires a dedicated **location permission declaration form**

Get any step wrong and your tracking won't start. The plugin won't crash — it'll simply reject the `start()` call with a clear error.

## Platform Setup

Before any runtime permission code, the native projects need the right declarations.

### iOS: Info.plist

Add two usage description keys and enable background modes. In Xcode, open your app's `Info.plist` (or via **Signing & Capabilities**):

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to track your route.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Background location is needed for continuous tracking.</string>
```

Then enable **Background Modes → Location updates**:

```xml
<key>UIBackgroundModes</key>
<array>
  <string>location</string>
</array>
```

> **Tip:** Write clear, specific purpose strings. "We need your location" is vague. "Background location lets us track your delivery route even when the app is minimized" is what Apple reviewers want to see.

### Android: Manifest Permissions

The Capacitor plugin contributes its manifest entries automatically during `npx cap sync`. The required permissions are:

```
ACCESS_FINE_LOCATION                 <!-- GPS -->
ACCESS_COARSE_LOCATION               <!-- Wi-Fi / Cell -->
ACCESS_BACKGROUND_LOCATION           <!-- Android 10+ -->
FOREGROUND_SERVICE                   <!-- Required for foreground service -->
FOREGROUND_SERVICE_LOCATION          <!-- Android 14+ -->
POST_NOTIFICATIONS                   <!-- Android 13+ notification -->
```

You don't need to add these manually — the manifest merger handles it.

## The Runtime Permission Flow

Here's where it gets interesting. The golden rule:

> **Request foreground location first. Then request background location as a separate step.**

This isn't a suggestion — on Android 10+, requesting both at the same time will silently fail. iOS handles escalation automatically, but the two-step approach gives you explicit control on both platforms.

### Step 1: Check Current Status

```typescript
import { BackgroundLocation } from '@bglocation/capacitor';

const status = await BackgroundLocation.checkPermissions();
console.log('Foreground:', status.location);           // 'granted' | 'denied' | 'prompt'
console.log('Background:', status.backgroundLocation); // 'granted' | 'denied' | 'prompt'
```

The `PermissionState` values:

| Value | Meaning |
|-------|---------|
| `'prompt'` | Never asked, or can ask again |
| `'granted'` | Permission active |
| `'denied'` | Explicitly denied or blocked in system Settings |

### Step 2: Request Foreground Permission

The plugin uses a single `requestPermissions()` method for both foreground and background — the `permissions` array controls *which* permission you're requesting. Passing `'location'` asks for foreground (GPS access while the app is visible). Passing `'backgroundLocation'` asks for background (covered in the next step).

```typescript
if (status.location !== 'granted') {
  const result = await BackgroundLocation.requestPermissions({
    permissions: ['location'],  // 'location' = foreground only
  });

  if (result.location !== 'granted') {
    // User denied foreground location — show explanation, open Settings
    console.warn('Foreground location denied');
    return;
  }
}
```

On iOS, this triggers the standard "Allow While Using" / "Allow Once" / "Don't Allow" dialog.

On Android, this triggers the standard location permission dialog.

### Step 3: Request Background Permission

Only request background location after foreground has been granted — otherwise this step will silently fail on Android:

```typescript
if (status.location === 'granted' && status.backgroundLocation !== 'granted') {
  const result = await BackgroundLocation.requestPermissions({
    permissions: ['backgroundLocation'],  // 'backgroundLocation' = "Allow all the time"
  });

  if (result.backgroundLocation !== 'granted') {
    console.warn('Background location denied');
    return;
  }
}
```

**On iOS**, calling this triggers the Always authorization request. If the user already granted "While Using," iOS may show an automatic upgrade dialog asking if they want to allow "Always." This happens once — if the user declines, the state remains `'prompt'` (since "While Using" is still active), but the system won't show the upgrade dialog again. The only path forward at that point is directing the user to Settings > Privacy > Location Services.

**On Android 10**, this shows a system dialog with "Allow all the time" as an option. **On Android 11+**, there's no in-app dialog — the user is directed to the system Settings screen where they must select "Allow all the time" manually. This is a deliberate Google policy decision to make background location harder to grant.

### Step 4: Handle the Permission Rationale (Android 11+)

On Android 11 and above, the plugin emits an `onPermissionRationale` event before requesting background location. This is your chance to show a custom in-app explanation *before* the user gets sent to system Settings:

```typescript
BackgroundLocation.addListener('onPermissionRationale', (event) => {
  // Show your custom UI here
  // event.message contains a human-readable explanation
  // event.shouldShowRationale indicates if the system recommends showing one
  showCustomRationaleDialog(event.message);
});
```

This event fires when foreground permission is granted but background is not yet. Use it to explain *why* your app needs "Allow all the time" — users are far more likely to grant it when they understand the reason.

## Putting It All Together

Here's a complete permission request flow you can use in a Capacitor app:

```typescript
import { BackgroundLocation } from '@bglocation/capacitor';

async function requestLocationPermissions(): Promise<boolean> {
  // Check current state
  let status = await BackgroundLocation.checkPermissions();

  // Request foreground if needed
  if (status.location !== 'granted') {
    status = await BackgroundLocation.requestPermissions({
      permissions: ['location'],
    });
  }

  if (status.location !== 'granted') {
    return false; // Can't proceed without foreground location
  }

  // Request background if needed
  if (status.backgroundLocation !== 'granted') {
    status = await BackgroundLocation.requestPermissions({
      permissions: ['backgroundLocation'],
    });
  }

  return status.backgroundLocation === 'granted';
}
```

## Edge Case: iOS Approximate Location

Starting with iOS 14, users can grant only **approximate location** (a radius of a few kilometers instead of precise GPS). This is a separate toggle from the "While Using" / "Always" choice — and it can silently degrade your tracking accuracy to the point of being useless for most use cases.

The plugin detects this automatically. When you call `start()`, if the user has granted only approximate location, the plugin emits an `onAccuracyWarning` event:

```typescript
BackgroundLocation.addListener('onAccuracyWarning', (event) => {
  console.log('Accuracy:', event.accuracyAuthorization); // 'full' or 'approximate'
  console.log(event.message);

  // Show UI asking user to enable precise location in Settings
});
```

> **Note:** The plugin automatically requests temporary full accuracy when it detects approximate location. But the user ultimately controls this setting — you should handle the case where they decline.

## Edge Case: "Don't Ask Again" (Android)

On Android, if a user denies a permission twice, the system will never show the dialog again. The state becomes permanently `'denied'`. At this point, the only option is to send the user to the app's system Settings page:

```typescript
import { Capacitor } from '@capacitor/core';

const status = await BackgroundLocation.checkPermissions();

if (status.location === 'denied') {
  // Permission permanently denied — direct user to Settings
  if (Capacitor.getPlatform() === 'android') {
    // Show a dialog explaining they need to enable location in Settings
    showSettingsRedirectDialog();
  }
}
```

## What Happens If You Skip a Step?

The plugin is strict about permissions for a reason — tracking without proper authorization wastes battery and violates platform guidelines. Here's what happens:

| Scenario | Result |
|----------|--------|
| `start()` without any location permission | Rejects with `"Location permission not granted"` |
| `start()` with foreground only (Android 10+) | Rejects with a message indicating background location permission is required |
| `start()` with approximate location (iOS) | Starts, but emits `onAccuracyWarning` — tracking works with degraded precision |

No silent failures. You get clear error messages and events.

## App Store & Play Store Review Tips

Getting permission-related rejections is frustrating. Here's how to avoid them:

### Apple App Store

- **Purpose strings matter.** Generic descriptions like "We need your location" will get rejected. Be specific: "Tracks your delivery route in the background so dispatchers can provide real-time ETAs to customers."
- **Only request "Always" if you truly need it.** Apple reviewers will test your app and check whether background location is essential to your core functionality.
- **Include notes for reviewers.** In App Store Connect → App Review Information, explain exactly when and why your app uses background location.
- **The blue location bar is expected.** When background tracking is active, iOS shows a blue bar (or blue pill on newer iOS). This is correct behavior — don't try to suppress it.

### Google Play Store

- **Complete the location permission declaration form** in Play Console → App Content → Sensitive app permissions. Without this, your app update will be rejected.
- **Show an in-app disclosure before requesting background location.** This is a Google policy requirement — the `onPermissionRationale` event is designed exactly for this.
- **The foreground service notification is required.** The plugin handles this automatically via the `notification` config. Customize it with your app name and purpose.
- **Record a video.** If your background location use isn't obvious from the UI, record a demo video showing the user flow and attach it to the declaration form.

## Checklist

Before shipping your Capacitor app with background location:

- [ ] **iOS**: `NSLocationWhenInUseUsageDescription` and `NSLocationAlwaysAndWhenInUseUsageDescription` in Info.plist with descriptive strings
- [ ] **iOS**: Background Modes → Location updates enabled
- [ ] **Android**: All required manifest permissions included (auto via `cap sync`)
- [ ] **Runtime**: Two-step flow — foreground first, background second
- [ ] **Android 11+**: `onPermissionRationale` listener with custom explanation UI
- [ ] **iOS 14+**: `onAccuracyWarning` listener handling approximate location
- [ ] **Denial handling**: Check for `'denied'` state and direct user to Settings
- [ ] **Error handling**: Handle `start()` rejection when permissions missing
- [ ] **Play Store**: Location permission declaration form completed
- [ ] **App Store**: Purpose strings reviewed, background usage explained in review notes

## What's Next

Once permissions are in place, you're ready to start tracking. If you're new to the plugin, the [documentation](https://bglocation.dev/docs/quick-start) covers the full setup — from configuration to handling location events.

If your tracking works on a Pixel but dies on a Xiaomi, that's a different problem. Android OEM battery killers are the next boss fight — and the plugin has tools for that too (`onBatteryWarning`, `checkBatteryOptimization()`). But that's a story for another post.
