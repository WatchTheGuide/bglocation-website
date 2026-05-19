---
title: "How to Keep Background Location Running on iOS After the App is Killed"
slug: "background-location-ios-app-killed"
description: "Why iOS suspends and kills apps doing background location — and what you need to understand to build tracking that actually survives in production."
date: "2026-05-19"
tags: ["ios", "capacitor", "react-native", "background-location", "mobile"]
published: true
author: "Szymon Walczak"
cover_image: null
canonical_url: "https://bglocation.dev/blog/background-location-ios-app-killed"
---

## "It Works Until I Lock My Phone"

You've got background location running. The simulator shows coordinates flowing in. You test on a real iPhone, open the app, start tracking, and GPS events arrive reliably. Then you lock the screen. Or swipe out of the app. Or leave the phone in your pocket for ten minutes. The coordinates stop.

This isn't a bug you can fix by tweaking a timer or adding a retry loop. It's iOS behaving exactly as designed — and understanding *why* it works this way is the only path to building location tracking that actually survives in production.

## iOS Is Not Android

The first mistake developers make is treating iOS background behavior as a variant of Android. It isn't. On Android, the battle is against OEM battery killers — Xiaomi, Samsung, Huawei adding proprietary power management layers that kill processes in ways the API doesn't expose. The OS model is relatively permissive; the manufacturers are the problem.

On iOS, the OS itself is the gatekeeper. Apple controls both the hardware and the software, which means behavior is consistent across all iPhones — but the rules are strict, enforced uniformly, and enforced without exceptions. There are no hidden OEM restrictions to detect and work around. There is no "dontkillmyapp.com" equivalent for iOS. What you see in the documentation is what you get.

## How iOS Handles App Lifecycle

iOS manages app state through five stages:

| State | What it means |
|---|---|
| **Active** | App is in the foreground, receiving events |
| **Inactive** | Transitioning — e.g., incoming call overlay |
| **Background** | App is not visible, but code can still run briefly |
| **Suspended** | App is in memory but CPU is frozen |
| **Terminated** | App is no longer in memory |

The transition from *background* to *suspended* happens automatically, typically within a few seconds of the app leaving the foreground. Once suspended, your JavaScript timer stops. Your `setInterval` stops. Any location updates flowing through a JS bridge stop too — because the entire JS runtime is frozen. This is why a pure JavaScript implementation of background tracking will never work on iOS. The bridge isn't running.

## The Three Failure Modes

Developers running into iOS background location issues almost always hit one of three scenarios:

### 1. Tracking stops after the app is minimized

The app goes to the background, runs briefly, then gets suspended. GPS events stop arriving. This happens when the app hasn't declared the correct background capability — or when the native layer isn't keeping a location session alive independent of the JS runtime. The fix isn't in JavaScript.

### 2. Tracking stops when the user swipes the app away

The user explicitly terminates the app from the app switcher. Most developers assume this is the end of the road — if the user killed the app, surely GPS is dead. Not necessarily. 

iOS provides mechanisms for a properly configured app to be relaunched silently in the background when significant movement is detected. The app never appears in the foreground. The user doesn't see anything. Location data continues to arrive — and if the native layer is posting it to your server directly, it reaches your backend without the user ever reopening the app. Whether your setup handles this depends entirely on the native layer, not on your JavaScript code.

### 3. Tracking stops after an extended period with no movement

The user parks a vehicle. No GPS movement for two hours. Then they drive again — and the first few minutes of the new journey are missing. This is related to how iOS balances accuracy against battery. In low-movement conditions, the OS reduces the frequency of GPS updates. A native layer that doesn't account for this will deliver a gap in the track.

## What JavaScript Can and Cannot Do

It's worth being explicit about this, because it's where most confusion starts.

**JavaScript can:**
- Configure tracking parameters (distance filter, desired accuracy, HTTP endpoint)
- Receive location events when the app is active or briefly in the background
- Start and stop a tracking session
- Handle events and update UI

**JavaScript cannot:**
- Keep itself running when iOS suspends the app
- Register for OS-level relaunch events
- Post location data to your server when the JS bridge is frozen
- Maintain a persistent foreground service (that's an Android concept)

Anything that needs to happen while the app is suspended or terminated must be handled in the native layer — Swift on iOS. The JavaScript API is the control surface; the native layer does the actual work.

## The "Always" Permission Is Not Optional

For any of this to work — surviving minimize, surviving swipe-to-kill, getting background relaunches — your app needs the "Always" location authorization. 

"While Using" authorization does allow some background location — the app continues receiving GPS updates after it's minimized, as long as it was actively tracking when it went to the background. iOS shows a blue pill indicator at the top of the screen to signal this. But "While Using" has a hard limit: if the app is killed — either by the user or by the OS — it cannot be relaunched automatically. iOS will not wake it up on movement. The tracking session is gone.

"Always" authorization removes that limit. A properly configured app can be silently relaunched by iOS when significant movement is detected, even if the user has explicitly swiped it away. No foreground. No UI. The app runs briefly in the background, location data is captured and sent to your backend, and the app suspends again. This is what makes "Always" non-negotiable for reliable continuous tracking.

The permission flow is a two-stage escalation:

1. The user grants "While Using"
2. iOS later prompts them to upgrade to "Always" — either through a system prompt or through your explicit request

This escalation only gets one automatic system prompt. If the user declines, they need to go to **Settings → Privacy & Security → Location Services** and change it manually. This is intentional. Apple makes "Always" hard to grant because it's a genuine privacy concern.

The App Store review team will check this. If your app requests "Always" authorization without a clear, functional reason shown to reviewers, it will be rejected.

## What bglocation Handles

When you call `start()` in `@bglocation/capacitor` or `@bglocation/react-native`, you're not starting a JavaScript-based tracker. You're handing control to the native layer, which manages the GPS session independently of the JS runtime.

This means:

- The native layer continues running when the app is suspended
- Location data is buffered natively when the JS bridge is unavailable
- If your configuration includes an HTTP endpoint, location points are posted directly from the native layer — without waiting for the JS bridge to wake up
- If the app is terminated by the user, the native layer can request a background relaunch from iOS on significant movement

From the JavaScript side, the API stays simple:

```typescript
import { BackgroundLocation } from '@bglocation/capacitor';

await BackgroundLocation.configure({
  distanceFilter: 10,
  http: {
    url: 'https://api.yourapp.com/locations',
  },
});

await BackgroundLocation.start();
```

When the app relaunches in the background, bglocation's native initialization runs before the JS bridge is even ready. Any buffered points are flushed. The tracking session resumes. By the time your JavaScript code executes, the data is already on its way to your backend.

## iOS 14 and Approximate Location

There's one iOS-specific wrinkle that catches developers off guard: **Precise vs. Approximate Location**.

Since iOS 14, users can grant location access with "Precise Location" turned off. Instead of GPS coordinates, your app receives a large radius (several kilometers) that changes infrequently. For most background location use cases — delivery tracking, fleet monitoring, workout routes — approximate location is useless. A radius of a few kilometers tells you roughly which city someone is in, not where they are.

The plugin emits an `onAccuracyWarning` event when approximate location is active:

```typescript
BackgroundLocation.addListener('onAccuracyWarning', (event) => {
  // event.accuracyAuthorization: 'full' | 'approximate'
  // Show UI asking the user to enable Precise Location in Settings
  console.log(event.message);
});
```

The system dialog for enabling precise location can't be triggered programmatically — the user must go to Settings. But you can detect the condition and guide them there.

## Testing Background Location on iOS

This is where most developers lose hours they won't get back. The **iOS Simulator** does not simulate background suspension, app termination, or relaunch. You can fake GPS coordinates, but you cannot test what happens when the app is killed. The simulator is useful for the happy path; it tells you nothing about background survival.

You need a **physical device**.

When testing on device:

1. Start tracking through your app
2. Lock the screen and put the device down for a few minutes
3. Swipe the app out of the app switcher
4. Wait, then check whether location events reached your backend

Xcode's **Debug → Simulate Location** lets you inject a moving path from a GPX file — useful for simulating a vehicle route without leaving your desk.

For the "terminated app relaunch" scenario: start tracking, kill the app from the app switcher, then physically move with the device. If the native layer is configured correctly, your backend should receive location points even though the app was never reopened.

## Before You Ship: iOS Checklist

- [ ] **Info.plist**: Both `NSLocationWhenInUseUsageDescription` and `NSLocationAlwaysAndWhenInUseUsageDescription` present with specific, descriptive strings
- [ ] **Background Modes**: Location updates enabled in Xcode → Signing & Capabilities
- [ ] **Permission flow**: Request "While Using" first, then escalate to "Always" as a separate step
- [ ] **Approximate location**: `onAccuracyWarning` listener in place, with UI guiding users to enable Precise Location
- [ ] **App Store notes**: Explain the background location use case to reviewers in App Store Connect → App Review Information
- [ ] **Tested on device**: Not just simulator — physical iPhone, with the app killed and relaunched
- [ ] **Tested the terminated scenario**: Kill the app, move around, verify data reaches your backend

## The Platform Pair

iOS and Android look similar from the JavaScript side — the same `start()` / `stop()` API, the same location events, the same HTTP posting configuration. But the failure modes are completely different platforms underneath.

On Android, the enemy is the OEM layer — inconsistent, undocumented, and different on every device. If you haven't read about surviving Android battery killers in Capacitor apps, that's the other half of this problem.

On iOS, the rules are consistent and enforced uniformly. The challenge is architectural: background tracking requires a native layer that operates independently of the JavaScript runtime. If your setup relies on JavaScript staying alive in the background, it will fail — reliably, on every iPhone.

Get the native layer right, and iOS background location is actually more predictable than Android. The OS won't surprise you. It will do exactly what it documents.
