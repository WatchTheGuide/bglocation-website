'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import {
  createAdminMagicLinkToken,
  createAdminSession,
  verifyAdminMagicLinkToken,
  destroyAdminSession,
  getAdminSession,
} from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { AdminMagicLinkEmail } from '@/emails/admin-magic-link';

export type AdminMagicLinkState = {
  success?: boolean;
  error?: string;
} | null;

export async function sendAdminMagicLinkAction(
  _prevState: AdminMagicLinkState,
  formData: FormData,
): Promise<AdminMagicLinkState> {
  const email = (formData.get('email') as string)?.toLowerCase().trim();
  if (!email) {
    return { error: 'Please enter your email address.' };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!admin) {
    // Don't reveal whether admin exists
    return { success: true };
  }

  const token = await createAdminMagicLinkToken(admin.email, admin.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://bglocation.dev';
  const loginUrl = `${baseUrl}/admin/verify?token=${token}`;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔗 [Dev] Admin magic link for ${admin.email}:\n${loginUrl}\n`);
    const fs = await import('fs');
    fs.writeFileSync('/tmp/bgl-admin-magic-link.txt', loginUrl);
  }

  await sendEmail({
    to: admin.email,
    subject: 'Admin sign-in to BGLocation',
    react: AdminMagicLinkEmail({ loginUrl }),
  });

  return { success: true };
}

export async function verifyAdminTokenAction(token: string): Promise<boolean> {
  const result = await verifyAdminMagicLinkToken(token);
  if (!result) return false;

  await createAdminSession(result.adminId, result.email);
  return true;
}

export async function adminLogoutAction() {
  await destroyAdminSession();
  redirect('/admin/login');
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function toggleLicenseActiveAction(
  licenseId: string,
  active: boolean,
): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  if (!UUID_RE.test(licenseId)) {
    return { success: false, error: 'Invalid license ID.' };
  }

  await prisma.license.update({
    where: { id: licenseId },
    data: { active },
  });

  return { success: true };
}
