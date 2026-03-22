'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

export function ConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'expired' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleConfirm() {
    if (!token) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message === 'Already confirmed') {
          setStatus('already');
        } else {
          setStatus('success');
        }
      } else if (res.status === 410) {
        setStatus('expired');
      } else {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error ?? 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
      setStatus('error');
    }
  }

  if (!token) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <XCircle className="mx-auto h-10 w-10 text-destructive" />
            <CardTitle className="mt-4">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This confirmation link is invalid or incomplete.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          {status === 'success' || status === 'already' ? (
            <CheckCircle className="mx-auto h-10 w-10 text-green-600 dark:text-green-400" />
          ) : status === 'error' || status === 'expired' ? (
            <XCircle className="mx-auto h-10 w-10 text-destructive" />
          ) : (
            <Mail className="mx-auto h-10 w-10 text-primary" />
          )}

          <CardTitle className="mt-4">
            {status === 'idle' && 'Confirm Your Subscription'}
            {status === 'loading' && 'Confirming...'}
            {status === 'success' && 'Subscription Confirmed!'}
            {status === 'already' && 'Already Confirmed'}
            {status === 'expired' && 'Link Expired'}
            {status === 'error' && 'Confirmation Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'idle' && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Click the button below to confirm your newsletter subscription.
              </p>
              <Button onClick={handleConfirm}>Confirm My Subscription</Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {status === 'success' && (
            <p className="text-muted-foreground">
              You&apos;re all set! You&apos;ll receive updates about new
              platforms and features.
            </p>
          )}

          {status === 'already' && (
            <p className="text-muted-foreground">
              Your subscription was already confirmed. No action needed.
            </p>
          )}

          {status === 'expired' && (
            <p className="text-muted-foreground">
              This confirmation link has expired. Please subscribe again on{' '}
              <Link href="/" className="text-primary underline hover:text-primary/80">
                bglocation.dev
              </Link>
              .
            </p>
          )}

          {status === 'error' && (
            <p className="text-muted-foreground">{errorMessage}</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
