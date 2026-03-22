import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ConfirmContent } from './confirm-content';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Confirm Subscription — bglocation',
  description: 'Confirm your bglocation newsletter subscription.',
};

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
