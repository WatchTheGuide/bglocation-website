import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not set');
  return new TextEncoder().encode(secret);
}

async function verifyToken(token: string, expectedType: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.type === expectedType;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Portal (customer) auth ---
  if (pathname.startsWith('/portal')) {
    if (pathname === '/portal/login' || pathname === '/portal/verify') {
      return NextResponse.next();
    }

    const token = request.cookies.get('bgl_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }

    if (await verifyToken(token, 'session')) {
      return NextResponse.next();
    }

    const response = NextResponse.redirect(new URL('/portal/login', request.url));
    response.cookies.delete('bgl_session');
    return response;
  }

  // --- Admin auth ---
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname === '/admin/verify') {
      return NextResponse.next();
    }

    const token = request.cookies.get('bgl_admin_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (await verifyToken(token, 'admin-session')) {
      return NextResponse.next();
    }

    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('bgl_admin_session');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*'],
};
