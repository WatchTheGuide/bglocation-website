import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { verifyAdminMagicLinkToken, createAdminSession } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Verify — Admin Panel',
};

export default async function AdminVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <VerifyError message="Missing verification token." />;
  }

  const result = await verifyAdminMagicLinkToken(token);
  if (!result) {
    return (
      <VerifyError message="Invalid or expired link. Please request a new one." />
    );
  }

  await createAdminSession(result.adminId, result.email);
  redirect('/admin');
}

function VerifyError({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h2 className="mb-2 text-lg font-semibold">Verification failed</h2>
            <p className="mb-4 text-muted-foreground">{message}</p>
            <Link
              href="/admin/login"
              className="text-primary hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
