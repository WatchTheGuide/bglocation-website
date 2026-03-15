import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/portal')) {
    return NextResponse.next();
  }

  // Allow access to login and verify pages without auth
  if (
    request.nextUrl.pathname === '/portal/login' ||
    request.nextUrl.pathname === '/portal/verify'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('bgl_session')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/portal/login', request.url));
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL('/portal/login', request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/portal/login', request.url));
    response.cookies.delete('bgl_session');
    return response;
  }
}

export const config = {
  matcher: ['/portal/:path*'],
};
