import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminLoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign In — Admin Panel',
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your admin email to receive a sign-in link.
        </p>
      </div>
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
