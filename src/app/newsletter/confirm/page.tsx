import { Suspense } from 'react';
import { ConfirmContent } from './confirm-content';
import { Loader2 } from 'lucide-react';

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
