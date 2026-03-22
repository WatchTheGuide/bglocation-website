import { type NextRequest, NextResponse } from 'next/server';
import {
  verifyMagicLinkToken,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      new URL('/portal/login?error=missing_token', request.url),
    );
  }

  const result = await verifyMagicLinkToken(token);
  if (!result) {
    return NextResponse.redirect(
      new URL('/portal/login?error=invalid_link', request.url),
    );
  }

  const sessionToken = await createSessionToken(
    result.customerId,
    result.email,
  );

  const response = NextResponse.redirect(
    new URL('/portal', request.url),
  );
  response.cookies.set(SESSION_COOKIE, sessionToken, SESSION_COOKIE_OPTIONS);
  return response;
}
