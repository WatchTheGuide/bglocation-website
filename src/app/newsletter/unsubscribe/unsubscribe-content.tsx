'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, MailX } from 'lucide-react';

export function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleUnsubscribe() {
    if (!token) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message === 'Already unsubscribed') {
          setStatus('already');
        } else {
          setStatus('success');
        }
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
              This unsubscribe link is invalid or incomplete.
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
          ) : status === 'error' ? (
            <XCircle className="mx-auto h-10 w-10 text-destructive" />
          ) : (
            <MailX className="mx-auto h-10 w-10 text-muted-foreground" />
          )}

          <CardTitle className="mt-4">
            {status === 'idle' && 'Unsubscribe'}
            {status === 'loading' && 'Processing...'}
            {status === 'success' && 'Unsubscribed'}
            {status === 'already' && 'Already Unsubscribed'}
            {status === 'error' && 'Something Went Wrong'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'idle' && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Click the button below to unsubscribe from the bglocation
                newsletter.
              </p>
              <Button variant="destructive" onClick={handleUnsubscribe}>
                Unsubscribe
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {status === 'success' && (
            <p className="text-muted-foreground">
              You&apos;ve been unsubscribed. You won&apos;t receive any more
              emails from us. We&apos;re sorry to see you go.
            </p>
          )}

          {status === 'already' && (
            <p className="text-muted-foreground">
              You&apos;re already unsubscribed. No further action needed.
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
