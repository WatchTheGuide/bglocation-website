import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign In — License Portal',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold">License Portal</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your email to receive a sign-in link.
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
