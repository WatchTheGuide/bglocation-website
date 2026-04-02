'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFramework } from '@/components/framework/framework-provider';

const LAUNCH_DATE = new Date('2026-04-26T22:00:00Z'); // April 27, 2026 00:00 CEST

const subscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft | null {
  const diff = LAUNCH_DATE.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl font-bold tabular-nums sm:text-5xl lg:text-6xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span className="self-start pt-2 text-3xl font-bold text-muted-foreground/50 sm:text-4xl lg:text-5xl">
      :
    </span>
  );
}

export function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft);
  const mounted = useMounted();
  const { frameworkHref } = useFramework();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // After launch date — show "Now Available" instead of countdown
  if (mounted && !timeLeft) {
    return (
      <section className="border-b bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 dark:bg-green-400/10 px-4 py-1.5 text-sm font-medium text-green-600 dark:text-green-400">
            <Rocket className="h-4 w-4" />
            Now Available
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            License Sales Are Open!
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Get your perpetual license and ship background location in production today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button render={<Link href={frameworkHref('/pricing')} />} nativeButton={false} size="lg">
              Get License — from $149
            </Button>
            <Button render={<Link href={frameworkHref('/docs')} />} nativeButton={false} variant="outline" size="lg">
              Read the Docs
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b bg-gradient-to-b from-primary/5 to-background py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Rocket className="h-4 w-4" />
          License Sales Launch
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 sm:gap-5">
          {mounted ? (
            <>
              <TimeUnit value={timeLeft?.days ?? 0} label="days" />
              <Separator />
              <TimeUnit value={timeLeft?.hours ?? 0} label="hours" />
              <Separator />
              <TimeUnit value={timeLeft?.minutes ?? 0} label="min" />
              <Separator />
              <TimeUnit value={timeLeft?.seconds ?? 0} label="sec" />
            </>
          ) : (
            // SSR placeholder to avoid hydration mismatch
            <div className="h-20 sm:h-24 lg:h-28" />
          )}
        </div>

        <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
          <strong>April 27, 2026</strong> — perpetual license keys go on sale.
          Install the plugin and try it today with trial mode.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button render={<Link href={frameworkHref('/#newsletter-cta')} />} nativeButton={false} size="lg" variant="outline">
            Get Notified
          </Button>
          <Button render={<Link href={frameworkHref('/pricing')} />} nativeButton={false} size="lg" variant="outline">
            View Pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
