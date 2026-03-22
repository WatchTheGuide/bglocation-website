'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import {
  createMagicLinkToken,
  createSession,
  verifyMagicLinkToken,
  destroySession,
  getSession,
} from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { generateLicenseKey, isValidBundleId } from '@/lib/license';
import { MagicLinkEmail } from '@/emails/magic-link';
import { LicenseKeyEmail } from '@/emails/license-key';

export type MagicLinkState = {
  success?: boolean;
  error?: string;
} | null;

export type GenerateKeyState = {
  success?: boolean;
  error?: string;
  licenseKey?: string;
  bundleId?: string;
  updatesUntil?: string;
} | null;

export async function sendMagicLinkAction(
  _prevState: MagicLinkState,
  formData: FormData,
): Promise<MagicLinkState> {
  const email = (formData.get('email') as string)?.toLowerCase().trim();
  if (!email) {
    return { error: 'Please enter your email address.' };
  }

  const customer = await prisma.customer.findUnique({
    where: { email },
  });

  if (!customer) {
    // Don't reveal whether customer exists — always show success
    return { success: true };
  }

  const token = await createMagicLinkToken(customer.email, customer.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://bglocation.dev';
  const loginUrl = `${baseUrl}/portal/verify?token=${token}`;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔗 [Dev] Magic link for ${customer.email}:\n${loginUrl}\n`);
    // Also write to file — Server Action console.log may not appear in terminal
    const fs = await import('fs');
    fs.writeFileSync('/tmp/bgl-magic-link.txt', loginUrl);
  }

  await sendEmail({
    to: customer.email,
    subject: 'Sign in to BGLocation',
    react: MagicLinkEmail({ loginUrl }),
  });

  return { success: true };
}

export async function verifyTokenAction(token: string): Promise<boolean> {
  const result = await verifyMagicLinkToken(token);
  if (!result) return false;

  await createSession(result.customerId, result.email);
  return true;
}

export async function generateKeyAction(
  _prevState: GenerateKeyState,
  formData: FormData,
): Promise<GenerateKeyState> {
  const session = await getSession();
  if (!session) redirect('/portal/login');

  const bundleId = (formData.get('bundleId') as string)?.trim();
  if (!bundleId || !isValidBundleId(bundleId)) {
    return {
      error:
        'Invalid bundle ID format. Use reverse-domain notation (e.g. com.example.app).',
    };
  }

  const customer = await prisma.customer.findUnique({
    where: { id: session.customerId },
  });

  if (!customer) redirect('/portal/login');

  // Check limit (0 = unlimited)
  if (customer.maxBundleIds > 0) {
    const licenseCount = await prisma.license.count({
      where: { customerId: customer.id, active: true },
    });
    if (licenseCount >= customer.maxBundleIds) {
      return {
        error: `You have reached the maximum of ${customer.maxBundleIds} bundle IDs for your ${customer.plan} plan.`,
      };
    }
  }

  // Check if bundle ID already exists (composite unique)
  const existing = await prisma.license.findUnique({
    where: {
      customerId_bundleId: { customerId: customer.id, bundleId },
    },
  });
  if (existing) {
    return { error: `A license key for "${bundleId}" already exists.` };
  }

  const { licenseKey, issuedAt, updatesUntil } = generateLicenseKey(bundleId);

  await prisma.license.create({
    data: {
      customerId: customer.id,
      bundleId,
      licenseKey,
      issuedAt,
      updatesUntil,
    },
  });

  // Send backup email
  await sendEmail({
    to: customer.email,
    subject: `License key for ${bundleId}`,
    react: LicenseKeyEmail({
      bundleId,
      licenseKey,
      updatesUntil: updatesUntil.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      plan: customer.plan,
    }),
  });

  return {
    success: true,
    licenseKey,
    bundleId,
    updatesUntil: updatesUntil.toISOString(),
  };
}

export async function logoutAction() {
  await destroySession();
  redirect('/portal/login');
}
