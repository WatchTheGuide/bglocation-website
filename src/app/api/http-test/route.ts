import { NextResponse } from 'next/server';
import { checkHttpTestRateLimit } from '@/lib/http-test/rate-limiter';

type JsonRecord = Record<string, unknown>;

type PayloadSummary = {
  locationCount: number;
  shape:
    | 'empty'
    | 'raw-text'
    | 'single-location'
    | 'location-wrapper'
    | 'locations-array'
    | 'location-array'
    | 'object'
    | 'array';
};

const CORS_HEADERS = (() => {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Device-Id, X-Requested-With, ngrok-skip-browser-warning',
    'Cache-Control': 'no-store',
  };

  const allowedOrigin =
    process.env.NEXT_PUBLIC_HTTP_TEST_ALLOWED_ORIGIN ??
    (process.env.NODE_ENV === 'production' ? '' : '*');

  if (allowedOrigin) {
    headers['Access-Control-Allow-Origin'] = allowedOrigin;
  }

  return headers;
})();

function jsonResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...CORS_HEADERS,
      ...(init?.headers ?? {}),
    },
  });
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isLocationLike(value: unknown): value is JsonRecord {
  if (!isJsonRecord(value)) {
    return false;
  }

  return typeof value.latitude === 'number' && typeof value.longitude === 'number';
}

function summarizePayload(payload: unknown): PayloadSummary {
  if (payload == null || payload === '') {
    return { locationCount: 0, shape: 'empty' };
  }

  if (typeof payload === 'string') {
    return { locationCount: 0, shape: 'raw-text' };
  }

  if (Array.isArray(payload)) {
    const locationItems = payload.filter(isLocationLike);
    return {
      locationCount: locationItems.length > 0 ? locationItems.length : 0,
      shape: locationItems.length > 0 ? 'location-array' : 'array',
    };
  }

  if (isLocationLike(payload)) {
    return { locationCount: 1, shape: 'single-location' };
  }

  if (!isJsonRecord(payload)) {
    return { locationCount: 0, shape: 'object' };
  }

  if (isLocationLike(payload.location)) {
    return { locationCount: 1, shape: 'location-wrapper' };
  }

  if (Array.isArray(payload.locations)) {
    const locationItems = payload.locations.filter(isLocationLike);
    return {
      locationCount: locationItems.length > 0 ? locationItems.length : payload.locations.length,
      shape: 'locations-array',
    };
  }

  return { locationCount: 0, shape: 'object' };
}

function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstForwarded = forwardedFor.split(',')[0]?.trim() ?? '';
    if (firstForwarded) {
      return firstForwarded;
    }
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    const trimmedRealIp = realIp.trim();
    if (trimmedRealIp) {
      return trimmedRealIp;
    }
  }

  return null;
}

function serializeForLog(payload: unknown): string {
  if (typeof payload === 'string') {
    return payload;
  }

  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return '[unserializable payload]';
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  return jsonResponse({
    ok: true,
    endpoint: '/api/http-test',
    method: 'POST',
    purpose: 'Debug endpoint for background location HTTP requests from test apps.',
    expectedPayloads: [
      {
        location: {
          latitude: 52.2297,
          longitude: 21.0122,
          accuracy: 5,
          speed: 1.2,
          heading: 180,
          altitude: 110.5,
          timestamp: 1700000000000,
          isMoving: true,
        },
      },
      {
        locations: [
          {
            latitude: 52.2297,
            longitude: 21.0122,
            timestamp: 1700000000000,
          },
        ],
      },
    ],
  });
}

const MAX_BODY_BYTES = 64 * 1024; // 64 KB

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const receivedAt = new Date().toISOString();
  const contentType = request.headers.get('content-type') ?? 'unknown';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';
  const clientIp = getClientIp(request);

  const requiredSecret = process.env.HTTP_TEST_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';

  // In production, require HTTP_TEST_SECRET to be set and valid to avoid
  // exposing this debug endpoint as an unauthenticated logging sink.
  if (isProduction) {
    if (!requiredSecret) {
      return jsonResponse(
        { received: false, error: 'HTTP test endpoint disabled: missing HTTP_TEST_SECRET' },
        { status: 503 },
      );
    }

    const auth = request.headers.get('authorization') ?? '';
    if (auth !== `Bearer ${requiredSecret}`) {
      return jsonResponse({ received: false, error: 'Unauthorized' }, { status: 401 });
    }
  } else if (requiredSecret) {
    // In non-production environments, enforce the secret only if configured.
    const auth = request.headers.get('authorization') ?? '';
    if (auth !== `Bearer ${requiredSecret}`) {
      return jsonResponse({ received: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  const rateLimitKey = clientIp ?? 'unknown';
  if (!checkHttpTestRateLimit(rateLimitKey)) {
    return jsonResponse(
      { received: false, error: 'Too many requests' },
      { status: 429 },
    );
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse(
      { received: false, error: `Body too large (limit ${MAX_BODY_BYTES} bytes)` },
      { status: 413 },
    );
  }

  const rawBody = await request.text();

  if (rawBody.length > MAX_BODY_BYTES) {
    return jsonResponse(
      { received: false, error: `Body too large (limit ${MAX_BODY_BYTES} bytes)` },
      { status: 413 },
    );
  }

  let payload: unknown = rawBody;
  let parseError: string | null = null;

  if (rawBody.length > 0 && contentType.includes('application/json')) {
    try {
      payload = JSON.parse(rawBody) as unknown;
    } catch {
      parseError = 'Invalid JSON body';
    }
  }

  const summary = summarizePayload(payload);

  console.log('[HTTP Test] Request received', {
    requestId,
    receivedAt,
    clientIp,
    contentType,
    userAgent,
    rawBodyBytes: rawBody.length,
    locationCount: summary.locationCount,
    shape: summary.shape,
    arrived: true,
  });
  console.log(`[HTTP Test] Body ${requestId}\n${serializeForLog(payload)}`);

  if (parseError) {
    console.warn('[HTTP Test] Request parse failed', {
      requestId,
      error: parseError,
    });

    return jsonResponse(
      {
        received: true,
        arrived: true,
        requestId,
        receivedAt,
        success: false,
        error: parseError,
        locationCount: 0,
        shape: 'raw-text',
      },
      { status: 400 },
    );
  }

  console.log('[HTTP Test] Request acknowledged', {
    requestId,
    statusCode: 200,
    locationCount: summary.locationCount,
    success: true,
  });

  return jsonResponse({
    received: true,
    arrived: true,
    success: true,
    requestId,
    receivedAt,
    locationCount: summary.locationCount,
    shape: summary.shape,
    contentType,
    message: 'HTTP test payload received',
  });
}