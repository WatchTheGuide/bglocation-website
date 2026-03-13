import { FlaskConical, Smartphone, TestTubes, Code, Eye } from "lucide-react";

const STATS = [
  { icon: TestTubes, value: "300+", label: "Unit Tests" },
  { icon: Smartphone, value: "2", label: "Native Platforms" },
  { icon: Code, value: "3,200+", label: "Lines of Native Code" },
  { icon: Eye, value: "Source", label: "Available (ELv2)" },
  { icon: FlaskConical, value: "1.06:1", label: "Test-to-Code Ratio" },
] as const;

export function TrustBar() {
  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
