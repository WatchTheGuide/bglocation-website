'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { sendAdminMagicLinkAction, type AdminMagicLinkState } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, CheckCircle } from 'lucide-react';

const VERIFY_ERRORS: Record<string, string> = {
  missing_token: 'Missing verification token.',
  invalid_link: 'Invalid or expired link. Please request a new one.',
};

export function AdminLoginForm() {
  const searchParams = useSearchParams();
  const verifyError = searchParams.get('error');
  const verifyErrorMessage = verifyError ? VERIFY_ERRORS[verifyError] : null;

  const [state, action, pending] = useActionState<AdminMagicLinkState, FormData>(
    sendAdminMagicLinkAction,
    null,
  );

  if (state?.success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h2 className="mb-2 text-lg font-semibold">Check your email</h2>
            <p className="text-muted-foreground">
              If an admin account exists with that email, we sent you a sign-in
              link. The link expires in 15 minutes.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Admin sign in
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {(verifyErrorMessage ?? state?.error) && (
            <Alert variant="destructive">
              <AlertDescription>{verifyErrorMessage ?? state?.error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@bglocation.dev"
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Sending...' : 'Send sign-in link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
