import { type NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminMagicLinkToken,
  createAdminSessionToken,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_COOKIE_OPTIONS,
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      new URL('/admin/login?error=missing_token', request.url),
    );
  }

  const result = await verifyAdminMagicLinkToken(token);
  if (!result) {
    return NextResponse.redirect(
      new URL('/admin/login?error=invalid_link', request.url),
    );
  }

  const sessionToken = await createAdminSessionToken(
    result.adminId,
    result.email,
  );

  const response = NextResponse.redirect(
    new URL('/admin', request.url),
  );
  response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, ADMIN_SESSION_COOKIE_OPTIONS);
  return response;
}
