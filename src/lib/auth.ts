import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'bgl_session';
export const ADMIN_SESSION_COOKIE = 'bgl_admin_session';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const MAGIC_LINK_TTL_SECONDS = 15 * 60; // 15 minutes

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function createMagicLinkToken(email: string, customerId: string): Promise<string> {
  return new SignJWT({ email, customerId, type: 'magic' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAGIC_LINK_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyMagicLinkToken(token: string): Promise<{ email: string; customerId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== 'magic') return null;
    return {
      email: payload.email as string,
      customerId: payload.customerId as string,
    };
  } catch {
    return null;
  }
}

export async function createSessionToken(customerId: string, email: string): Promise<string> {
  return new SignJWT({ customerId, email, type: 'session' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: SESSION_TTL_SECONDS,
  path: '/',
};

export async function createSession(customerId: string, email: string): Promise<void> {
  const token = await createSessionToken(customerId, email);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
}

export async function getSession(): Promise<{ customerId: string; email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== 'session') return null;
    return {
      customerId: payload.customerId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// --- Admin Auth ---

export async function createAdminMagicLinkToken(email: string, adminId: string): Promise<string> {
  return new SignJWT({ email, adminId, type: 'admin-magic' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAGIC_LINK_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAdminMagicLinkToken(token: string): Promise<{ email: string; adminId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== 'admin-magic') return null;
    return {
      email: payload.email as string,
      adminId: payload.adminId as string,
    };
  } catch {
    return null;
  }
}

export async function createAdminSessionToken(adminId: string, email: string): Promise<string> {
  return new SignJWT({ adminId, email, type: 'admin-session' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export const ADMIN_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: SESSION_TTL_SECONDS,
  path: '/',
};

export async function createAdminSession(adminId: string, email: string): Promise<void> {
  const token = await createAdminSessionToken(adminId, email);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, ADMIN_SESSION_COOKIE_OPTIONS);
}

export async function getAdminSession(): Promise<{ adminId: string; email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== 'admin-session') return null;
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
