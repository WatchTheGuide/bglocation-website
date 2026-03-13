import {
  MapPin,
  Wifi,
  WifiOff,
  Timer,
  Shield,
  Activity,
  Radio,
  Bug,
  BatteryWarning,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const FEATURES = [
  {
    icon: MapPin,
    title: "Background GPS Tracking",
    description:
      "Continuous location updates even when the app is in the background. CLLocationManager on iOS, FusedLocationProviderClient on Android.",
  },
  {
    icon: Wifi,
    title: "Native HTTP Posting",
    description:
      "Send locations directly from the native layer to your backend. No JavaScript wake-up needed.",
  },
  {
    icon: WifiOff,
    title: "Offline Buffer",
    description:
      "SQLite-backed queue stores locations when offline. Automatic retry and FIFO flush when connectivity returns.",
  },
  {
    icon: Timer,
    title: "Heartbeat Timer",
    description:
      "Periodic events even when stationary. Know your device is alive with configurable heartbeat intervals.",
  },
  {
    icon: Activity,
    title: "Adaptive Distance Filter",
    description:
      "Auto-adjusts distance filter based on speed. Walk, bike, or drive — always optimal GPS usage and battery life.",
  },
  {
    icon: Shield,
    title: "Offline License Validation",
    description:
      "RSA-2048 signed keys verified locally. No phone-home, no server dependency. Works fully offline.",
  },
  {
    icon: Radio,
    title: "SLC Fallback (iOS)",
    description:
      "Significant Location Change watchdog auto-restarts GPS if iOS kills your app. Your tracking resumes silently.",
  },
  {
    icon: Bug,
    title: "Debug Mode",
    description:
      "Verbose logs, onDebug events, optional system sounds. Dynamic Android notification with GPS counters.",
  },
  {
    icon: BatteryWarning,
    title: "Battery Optimization Detection",
    description:
      "Detects OEM battery killers on Android with dontkillmyapp.com links. Warns when tracking may be interrupted.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need for Location Tracking
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Built from scratch with Capacitor 8 native APIs. No wrappers, no
            legacy Cordova code — pure Kotlin and Swift.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="border-border/50">
              <CardHeader>
                <feature.icon className="mb-2 h-6 w-6 text-primary" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
