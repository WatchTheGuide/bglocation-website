import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  // Support RFC 8058 one-click unsubscribe: token in query string
  const url = new URL(req.url);
  const queryToken = url.searchParams.get('token');

  let token: unknown = queryToken;

  // If no token in query, try JSON body (frontend two-step flow)
  if (!token) {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!body || typeof body !== 'object' || !('token' in body)) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    token = (body as { token: unknown }).token;
  }

  if (typeof token !== 'string' || token.length === 0) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  const subscriber = await prisma.subscriber.findUnique({
    where: { unsubToken: token },
  });

  if (!subscriber) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  if (subscriber.status === 'unsubscribed') {
    return NextResponse.json({ message: 'Already unsubscribed' });
  }

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      status: 'unsubscribed',
      unsubscribedAt: new Date(),
      confirmToken: null,
      confirmTokenExpiresAt: null,
    },
  });

  return NextResponse.json({ message: 'Successfully unsubscribed' });
}
