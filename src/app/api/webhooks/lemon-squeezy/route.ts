import { type NextRequest, NextResponse } from "next/server";

type LemonSqueezyEvent =
  | "order_created"
  | "subscription_payment_success"
  | "subscription_expired";

interface WebhookPayload {
  meta: {
    event_name: LemonSqueezyEvent;
    custom_data?: Record<string, string>;
  };
  data: {
    id: string;
    type: string;
    attributes: Record<string, unknown>;
  };
}

async function verifySignature(
  rawBody: string,
  signature: string | null,
  secret: string,
): Promise<boolean> {
  if (!signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const expectedSignature = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison
  if (expectedSignature.length !== signature.length) return false;
  let result = 0;
  for (let i = 0; i < expectedSignature.length; i++) {
    result |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(request: NextRequest) {
  const secret = process.env.LS_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[LS Webhook] LS_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  const isValid = await verifySignature(rawBody, signature, secret);
  if (!isValid) {
    console.error("[LS Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta.event_name;
  console.log(`[LS Webhook] Received event: ${eventName}`);

  switch (eventName) {
    case "order_created":
      await handleOrderCreated(payload);
      break;
    case "subscription_payment_success":
      await handleSubscriptionPaymentSuccess(payload);
      break;
    case "subscription_expired":
      await handleSubscriptionExpired(payload);
      break;
    default:
      console.log(`[LS Webhook] Unhandled event: ${eventName}`);
  }

  return NextResponse.json({ received: true });
}

async function handleOrderCreated(payload: WebhookPayload) {
  const { attributes } = payload.data;
  console.log("[LS Webhook] Order created:", {
    orderId: payload.data.id,
    email: attributes.user_email,
    status: attributes.status,
  });

  // TODO (US-3): Save customer to database and send welcome email with portal link
}

async function handleSubscriptionPaymentSuccess(payload: WebhookPayload) {
  const { attributes } = payload.data;
  console.log("[LS Webhook] Subscription payment success:", {
    subscriptionId: payload.data.id,
    email: attributes.user_email,
    status: attributes.status,
  });

  // TODO (US-4): Generate new license key and email to customer
}

async function handleSubscriptionExpired(payload: WebhookPayload) {
  console.log("[LS Webhook] Subscription expired:", {
    subscriptionId: payload.data.id,
  });

  // TODO (US-4): Mark customer as expired in database
}
