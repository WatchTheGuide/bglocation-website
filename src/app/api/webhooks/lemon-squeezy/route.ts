import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generateLicenseKey } from "@/lib/license";
import { WelcomeEmail } from "@/emails/welcome";
import { LicenseKeyEmail } from "@/emails/license-key";
import { Prisma, type Plan, type OrderType } from "@prisma/client";

type LemonSqueezyEvent = "order_created";
const SERIALIZATION_RETRY_LIMIT = 3;

const PLAN_RANK: Record<Plan, number> = {
  indie: 1,
  team: 2,
  factory: 3,
  enterprise: 4,
};

/** Return the higher-tier plan so downgrades never happen on repeat purchase. */
function higherPlan(a: Plan, b: Plan): Plan {
  return PLAN_RANK[a] >= PLAN_RANK[b] ? a : b;
}

async function upsertCustomerForOrder(params: {
  email: string;
  lsCustomerId: string;
  variant: {
    plan: Plan;
    maxBundleIds: number;
    orderType: OrderType;
  };
}) {
  const normalizedEmail = params.email.toLowerCase();

  for (let attempt = 0; attempt < SERIALIZATION_RETRY_LIMIT; attempt++) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          const existing = await transaction.customer.findUnique({
            where: { email: normalizedEmail },
          });

          if (!existing) {
            return transaction.customer.create({
              data: {
                lsCustomerId: params.lsCustomerId,
                email: normalizedEmail,
                plan: params.variant.plan,
                maxBundleIds: params.variant.maxBundleIds,
              },
            });
          }

          return transaction.customer.update({
            where: { id: existing.id },
            data: {
              lsCustomerId: params.lsCustomerId,
              plan: higherPlan(existing.plan, params.variant.plan),
              ...(params.variant.orderType === "purchase"
                ? { maxBundleIds: { increment: params.variant.maxBundleIds } }
                : {}),
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034" &&
        attempt < SERIALIZATION_RETRY_LIMIT - 1
      ) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Failed to upsert customer after serialization retries");
}

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

/**
 * Maps Lemon Squeezy variant IDs to plans.
 * Set LS_VARIANT_<PLAN> environment variables to configure.
 */
function resolveVariant(variantId: string): {
  plan: Plan;
  maxBundleIds: number;
  orderType: OrderType;
} | null {
  const mapping: Record<string, { plan: Plan; maxBundleIds: number }> = {};

  if (process.env.LS_VARIANT_INDIE)
    mapping[process.env.LS_VARIANT_INDIE] = { plan: "indie", maxBundleIds: 1 };
  if (process.env.LS_VARIANT_TEAM)
    mapping[process.env.LS_VARIANT_TEAM] = { plan: "team", maxBundleIds: 5 };
  if (process.env.LS_VARIANT_FACTORY)
    mapping[process.env.LS_VARIANT_FACTORY] = {
      plan: "factory",
      maxBundleIds: 20,
    };
  if (process.env.LS_VARIANT_ENTERPRISE)
    mapping[process.env.LS_VARIANT_ENTERPRISE] = {
      plan: "enterprise",
      maxBundleIds: 0,
    };

  // Renewal variants
  const renewalMapping: Record<string, { plan: Plan; maxBundleIds: number }> =
    {};
  if (process.env.LS_VARIANT_RENEWAL_INDIE)
    renewalMapping[process.env.LS_VARIANT_RENEWAL_INDIE] = {
      plan: "indie",
      maxBundleIds: 1,
    };
  if (process.env.LS_VARIANT_RENEWAL_TEAM)
    renewalMapping[process.env.LS_VARIANT_RENEWAL_TEAM] = {
      plan: "team",
      maxBundleIds: 5,
    };
  if (process.env.LS_VARIANT_RENEWAL_FACTORY)
    renewalMapping[process.env.LS_VARIANT_RENEWAL_FACTORY] = {
      plan: "factory",
      maxBundleIds: 20,
    };
  if (process.env.LS_VARIANT_RENEWAL_ENTERPRISE)
    renewalMapping[process.env.LS_VARIANT_RENEWAL_ENTERPRISE] = {
      plan: "enterprise",
      maxBundleIds: 0,
    };

  if (mapping[variantId]) {
    return { ...mapping[variantId], orderType: "purchase" };
  }
  if (renewalMapping[variantId]) {
    return { ...renewalMapping[variantId], orderType: "renewal" };
  }

  return null;
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

  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(rawBody),
  );
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
    default:
      console.log(`[LS Webhook] Unhandled event: ${eventName}`);
  }

  return NextResponse.json({ received: true });
}

async function handleOrderCreated(payload: WebhookPayload) {
  const { attributes } = payload.data;
  const email = attributes.user_email as string | undefined;
  const lsCustomerId = attributes.customer_id;
  const lsOrderId = payload.data.id;
  const status = attributes.status as string;

  if (!email || !lsCustomerId) {
    console.error("[LS Webhook] Missing required fields:", {
      email: !!email,
      customerId: !!lsCustomerId,
    });
    return;
  }

  console.log("[LS Webhook] Order created:", {
    orderId: lsOrderId,
    email,
    status,
  });

  if (status !== "paid") {
    console.log(`[LS Webhook] Skipping order with status: ${status}`);
    return;
  }

  // Resolve plan from variant
  const firstItem = attributes.first_order_item as
    | { variant_id?: number }
    | undefined;
  const variantId = String(firstItem?.variant_id ?? "");
  const variant = resolveVariant(variantId);

  if (!variant) {
    console.error(
      `[LS Webhook] Unknown variant ID: ${variantId} — configure LS_VARIANT_* env vars`,
    );
    return;
  }

  const customer = await upsertCustomerForOrder({
    email,
    lsCustomerId: String(lsCustomerId),
    variant,
  });

  // Record the order
  await prisma.order.create({
    data: {
      lsOrderId,
      customerId: customer.id,
      type: variant.orderType,
    },
  });

  // For renewals, regenerate license keys with new exp date
  if (variant.orderType === "renewal") {
    const activeLicenses = await prisma.license.findMany({
      where: { customerId: customer.id, active: true },
    });

    for (const license of activeLicenses) {
      const { licenseKey, updatesUntil } = generateLicenseKey(license.bundleId);

      await prisma.license.update({
        where: { id: license.id },
        data: {
          licenseKey,
          updatesUntil,
          renewedAt: new Date(),
        },
      });

      await sendEmail({
        to: customer.email,
        subject: `Renewed license key for ${license.bundleId}`,
        react: LicenseKeyEmail({
          bundleId: license.bundleId,
          licenseKey,
          updatesUntil: updatesUntil.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          plan: customer.plan,
        }),
      });
    }

    console.log(
      `[LS Webhook] Renewed ${customer.email} — ${activeLicenses.length} license(s) regenerated`,
    );
    return;
  }

  // New purchase — send welcome email
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bglocation.dev";
  const portalUrl = `${baseUrl}/portal/login`;

  await sendEmail({
    to: customer.email,
    subject: "Welcome to BGLocation — your license is ready",
    react: WelcomeEmail({ portalUrl, plan: variant.plan }),
  });

  console.log(
    `[LS Webhook] New customer ${customer.email} (${variant.plan}) — welcome email sent`,
  );
}
