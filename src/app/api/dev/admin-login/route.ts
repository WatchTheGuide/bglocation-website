import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  createAdminSessionToken,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_COOKIE_OPTIONS,
} from '@/lib/auth';

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

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  const token = await createAdminSessionToken(admin.id, admin.email);
  const response = NextResponse.redirect(new URL('/admin', request.url));
  response.cookies.set(ADMIN_SESSION_COOKIE, token, ADMIN_SESSION_COOKIE_OPTIONS);

  return response;
}
