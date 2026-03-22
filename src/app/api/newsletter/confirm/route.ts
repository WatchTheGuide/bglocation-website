import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || !('token' in body)) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const { token } = body as { token: unknown };

  if (typeof token !== 'string' || token.length === 0) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  const subscriber = await prisma.subscriber.findUnique({
    where: { confirmToken: token },
  });

  if (!subscriber) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  if (subscriber.status === 'confirmed') {
    return NextResponse.json({ message: 'Already confirmed' });
  }

  if (subscriber.confirmTokenExpiresAt && subscriber.confirmTokenExpiresAt < new Date()) {
    return NextResponse.json({ error: 'Token expired. Please subscribe again.' }, { status: 410 });
  }

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      status: 'confirmed',
      confirmedAt: new Date(),
      confirmToken: null,
      confirmTokenExpiresAt: null,
    },
  });

  return NextResponse.json({ message: 'Subscription confirmed' });
}
