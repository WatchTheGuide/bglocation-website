import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }

  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json(
      { error: 'Missing email param' },
      { status: 400 },
    );
  }

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  await createSession(customer.id, customer.email);

  return NextResponse.redirect(new URL('/portal', request.url));
}
