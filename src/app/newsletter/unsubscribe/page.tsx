import { Suspense } from 'react';
import { UnsubscribeContent } from './unsubscribe-content';
import { Loader2 } from 'lucide-react';

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
