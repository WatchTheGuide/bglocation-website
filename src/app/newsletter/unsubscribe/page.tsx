import { Suspense } from 'react';
import type { Metadata } from 'next';
import { UnsubscribeContent } from './unsubscribe-content';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Unsubscribe — bglocation',
  description: 'Unsubscribe from the bglocation newsletter.',
};

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
