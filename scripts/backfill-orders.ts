/**
 * Backfill script for EPIC-041: Order-based License Accounting
 *
 * Populates existing Order records with `plan` and `maxBundleIds` fields.
 *
 * Strategy:
 * - Renewal orders → maxBundleIds = 0 (they don't add slots)
 * - Customers with 1 purchase order → copy plan + maxBundleIds from Customer
 * - Customers with N purchase orders of same plan → assign variant default per order
 * - Customers with cross-plan purchase orders → flag for manual review
 *
 * Usage: npx tsx scripts/backfill-orders.ts
 */
import 'dotenv/config';
import { PrismaClient, type Plan } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const VARIANT_MAX_BUNDLE_IDS: Record<Plan, number> = {
  indie: 1,
  team: 5,
  factory: 20,
  enterprise: 0,
};

async function main() {
  console.log('Starting backfill of orders...\n');

  // 1. Set all renewal orders to maxBundleIds=0, plan from customer
  const renewalOrders = await prisma.order.findMany({
    where: { type: 'renewal', plan: null },
    include: { customer: { select: { plan: true } } },
  });

  for (const order of renewalOrders) {
    await prisma.order.update({
      where: { id: order.id },
      data: { plan: order.customer.plan, maxBundleIds: 0 },
    });
  }
  console.log(`✅ Updated ${renewalOrders.length} renewal orders (maxBundleIds=0)`);

  // 2. Process purchase orders per customer
  const customersWithPurchases = await prisma.customer.findMany({
    include: {
      orders: {
        where: { type: 'purchase', plan: null },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  let autoFixed = 0;
  let manualReview = 0;

  for (const customer of customersWithPurchases) {
    const purchaseOrders = customer.orders;
    if (purchaseOrders.length === 0) continue;

    if (purchaseOrders.length === 1) {
      // Single purchase → copy directly from customer
      await prisma.order.update({
        where: { id: purchaseOrders[0].id },
        data: {
          plan: customer.plan,
          maxBundleIds: customer.maxBundleIds,
        },
      });
      autoFixed++;
    } else {
      // Multiple purchase orders — check if all same plan
      // Since we don't know original per-order plans, use heuristic:
      // If customer.maxBundleIds = N * variant default, assign variant default per order
      const variantDefault = VARIANT_MAX_BUNDLE_IDS[customer.plan];
      const expectedTotal = purchaseOrders.length * variantDefault;

      if (variantDefault > 0 && expectedTotal === customer.maxBundleIds) {
        // Same-plan scenario: each order gets variant default
        for (const order of purchaseOrders) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              plan: customer.plan,
              maxBundleIds: variantDefault,
            },
          });
        }
        autoFixed++;
      } else if (variantDefault === 0) {
        // Enterprise unlimited
        for (const order of purchaseOrders) {
          await prisma.order.update({
            where: { id: order.id },
            data: { plan: customer.plan, maxBundleIds: 0 },
          });
        }
        autoFixed++;
      } else {
        // Cross-plan or ambiguous — flag for manual review
        console.warn(
          `⚠️  MANUAL REVIEW NEEDED: ${customer.email} (${customer.plan}, maxBundleIds=${customer.maxBundleIds}, ${purchaseOrders.length} purchase orders)`,
        );
        manualReview++;
      }
    }
  }

  console.log(`\n✅ Auto-backfilled: ${autoFixed} customers`);
  if (manualReview > 0) {
    console.log(`⚠️  Needs manual review: ${manualReview} customers`);
  }

  // 3. Verify: check SUM matches Customer.maxBundleIds for auto-backfilled customers
  console.log('\nVerification:');
  const allCustomers = await prisma.customer.findMany({
    include: {
      orders: { where: { type: 'purchase' } },
    },
  });

  let mismatches = 0;
  for (const c of allCustomers) {
    const hasUnlimited = c.orders.some((o) => o.maxBundleIds === 0 && o.plan !== null);
    const sum = hasUnlimited
      ? 0
      : c.orders.filter((o) => o.plan !== null).reduce((s, o) => s + o.maxBundleIds, 0);

    if (sum !== c.maxBundleIds) {
      // Only flag if all orders were backfilled (no null plans)
      const allBackfilled = c.orders.every((o) => o.plan !== null);
      if (allBackfilled) {
        console.warn(
          `⚠️  Mismatch: ${c.email} — SUM(orders)=${sum}, Customer.maxBundleIds=${c.maxBundleIds}`,
        );
        mismatches++;
      }
    }
  }

  if (mismatches === 0) {
    console.log('✅ All auto-backfilled customers have matching SUM(orders)');
  }

  console.log('\nBackfill complete.');
}

main()
  .catch((e) => {
    console.error('Backfill failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
