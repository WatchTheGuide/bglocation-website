import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { ConfirmSubscriptionEmail } from '@/emails/confirm-subscription';
import { checkNewsletterRateLimit } from '@/lib/newsletter/rate-limiter';
import { cleanupStaleSubscribers } from '@/lib/newsletter/cleanup';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONFIRM_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const VALID_SOURCES = ['footer', 'cta', 'chat'];
const VALID_PLATFORMS = ['capacitor', 'react-native', 'flutter', 'kmp'];

function getClientIp(req: Request): string | null {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return null;
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'https://bglocation.dev';
}

function checkOrigin(req: Request): boolean {
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!appUrl) return true; // skip check if not configured
  try {
    const allowedOrigin = new URL(appUrl).origin;
    const originHeader = req.headers.get('origin');
    if (!originHeader) return false;
    return new URL(originHeader).origin === allowedOrigin;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!checkOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = getClientIp(req);

  if (ip && !checkNewsletterRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, consent, source, platforms, website } = body as Record<string, unknown>;

  // Honeypot check — reject if filled
  if (website) {
    return NextResponse.json({ message: 'Check your email to confirm' });
  }

  if (typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (!EMAIL_RE.test(normalizedEmail)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  if (typeof consent !== 'string' || consent.length === 0) {
    return NextResponse.json({ error: 'Consent is required' }, { status: 400 });
  }

  const validSource = typeof source === 'string' && VALID_SOURCES.includes(source) ? source : 'footer';

  let validPlatforms: string[] = [];
  if (Array.isArray(platforms)) {
    validPlatforms = platforms.filter((p): p is string => typeof p === 'string' && VALID_PLATFORMS.includes(p));
  }

  // Lazy cleanup of stale records
  await cleanupStaleSubscribers();

  // Check for existing subscriber
  const existing = await prisma.subscriber.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    if (existing.status === 'confirmed') {
      // Already confirmed — don't reveal status, same success message
      return NextResponse.json({ message: 'Check your email to confirm' });
    }

    // Re-subscribe: regenerate token for both pending and unsubscribed
    const confirmToken = crypto.randomUUID();
    const confirmTokenExpiresAt = new Date(Date.now() + CONFIRM_TOKEN_TTL_MS);
    const unsubToken = existing.status === 'unsubscribed' ? crypto.randomUUID() : existing.unsubToken;

    await prisma.subscriber.update({
      where: { id: existing.id },
      data: {
        status: 'pending',
        confirmToken,
        confirmTokenExpiresAt,
        unsubToken,
        consentText: consent,
        ipAddress: ip,
        source: validSource,
        platforms: validPlatforms,
        confirmedAt: null,
        unsubscribedAt: null,
      },
    });

    const baseUrl = getBaseUrl();
    const confirmUrl = `${baseUrl}/newsletter/confirm?token=${confirmToken}`;
    const unsubUrl = `${baseUrl}/newsletter/unsubscribe?token=${unsubToken}`;
    const unsubApiUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${unsubToken}`;

    await sendEmail({
      to: normalizedEmail,
      subject: 'Confirm your bglocation newsletter subscription',
      react: ConfirmSubscriptionEmail({ confirmUrl, unsubUrl }),
      headers: {
        'List-Unsubscribe': `<${unsubApiUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });

    return NextResponse.json({ message: 'Check your email to confirm' });
  }

  // New subscriber
  const confirmToken = crypto.randomUUID();
  const confirmTokenExpiresAt = new Date(Date.now() + CONFIRM_TOKEN_TTL_MS);
  const unsubToken = crypto.randomUUID();

  await prisma.subscriber.create({
    data: {
      email: normalizedEmail,
      status: 'pending',
      platforms: validPlatforms,
      source: validSource,
      consentText: consent,
      ipAddress: ip,
      confirmToken,
      confirmTokenExpiresAt,
      unsubToken,
    },
  });

  const baseUrl = getBaseUrl();
  const confirmUrl = `${baseUrl}/newsletter/confirm?token=${confirmToken}`;
  const unsubUrl = `${baseUrl}/newsletter/unsubscribe?token=${unsubToken}`;
  const unsubApiUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${unsubToken}`;

  await sendEmail({
    to: normalizedEmail,
    subject: 'Confirm your bglocation newsletter subscription',
    react: ConfirmSubscriptionEmail({ confirmUrl, unsubUrl }),
    headers: {
      'List-Unsubscribe': `<${unsubApiUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });

  return NextResponse.json({ message: 'Check your email to confirm' });
}
