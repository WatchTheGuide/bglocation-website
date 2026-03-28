'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, CheckCircle, Loader2 } from 'lucide-react';

const CONSENT_TEXT =
  'I agree to receive product updates from bglocation. You can unsubscribe at any time.';

const PLATFORMS = [
  { value: 'capacitor', label: 'Capacitor' },
  { value: 'react-native', label: 'React Native' },
  { value: 'flutter', label: 'Flutter' },
  { value: 'kmp', label: 'Kotlin Multiplatform' },
];

export function NewsletterCta() {
  const [email, setEmail] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function togglePlatform(value: string) {
    setPlatforms((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) return;

    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: CONSENT_TEXT,
          source: 'cta',
          platforms,
          website: String(formData.get('website') ?? ''),
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
      setStatus('error');
    }
  }

  return (
    <section id="newsletter-cta" className="border-t bg-muted/30 py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Bell className="h-4 w-4" />
          React Native Is Live
        </div>

        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Follow The Next Wrapper Releases
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Capacitor and React Native are supported today. Subscribe for release
          notes, launch offers, and roadmap updates for Flutter and Kotlin
          Multiplatform.
        </p>

        {status === 'success' ? (
          <div className="mt-10 flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span className="text-lg font-medium">
              Check your email to confirm your subscription.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  aria-pressed={platforms.includes(p.value)}
                  onClick={() => togglePlatform(p.value)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    platforms.includes(p.value)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="mx-auto flex max-w-md gap-2">
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={status === 'loading' || !consent} aria-label={status === 'loading' ? 'Subscribing…' : undefined}>
                {status === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Notify Me'
                )}
              </Button>
            </div>

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <label className="mx-auto flex max-w-md items-start justify-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-input accent-primary"
                required
              />
              <span>
                {CONSENT_TEXT}{' '}
                <Link href="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {status === 'error' && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
