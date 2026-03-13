import { Card, CardContent } from "@/components/ui/card";

export function CodeExample() {
  return (
    <section className="border-y bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Up and Running in Minutes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Install from npm, configure once, start tracking. Works with any
            Capacitor 8 app — Ionic, React, Vue, Angular.
          </p>
        </div>

        <Card className="mx-auto mt-12 max-w-3xl overflow-hidden">
          <CardContent className="p-0">
            <pre className="overflow-x-auto p-6 text-sm leading-relaxed">
              <code className="font-mono text-foreground">{CODE_SNIPPET}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

const CODE_SNIPPET = `import { BackgroundLocation } from 'capacitor-bglocation';

// 1. Configure
await BackgroundLocation.configure({
  distanceFilter: 15,
  desiredAccuracy: 'high',
  heartbeatInterval: 15,
  http: {
    url: 'https://api.example.com/location',
    headers: { Authorization: 'Bearer <token>' },
    buffer: { maxSize: 1000 },
  },
});

// 2. Listen
BackgroundLocation.addListener('onLocation', (loc) => {
  console.log(loc.latitude, loc.longitude);
});

// 3. Start
await BackgroundLocation.start();`;
