import 'dotenv/config';
import { PrismaClient } from '.prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create test customer
  const customer = await prisma.customer.upsert({
    where: { email: 'test@bglocation.dev' },
    update: {},
    create: {
      lsCustomerId: 'ls_test_123',
      email: 'test@bglocation.dev',
      plan: 'team',
      maxBundleIds: 5,
    },
  });

  console.log('Created test customer:', customer.email, `(${customer.plan} plan, ${customer.maxBundleIds} slots)`);
  console.log('Customer ID:', customer.id);

  // Create test order
  const order = await prisma.order.upsert({
    where: { lsOrderId: 'ls_order_test_001' },
    update: {},
    create: {
      lsOrderId: 'ls_order_test_001',
      customerId: customer.id,
      type: 'purchase',
    },
  });

  console.log('Created test order:', order.lsOrderId, `(${order.type})`);

  // Create test license
  const license = await prisma.license.upsert({
    where: {
      customerId_bundleId: {
        customerId: customer.id,
        bundleId: 'com.test.app',
      },
    },
    update: {},
    create: {
      customerId: customer.id,
      bundleId: 'com.test.app',
      licenseKey: 'test-license-key-placeholder',
      issuedAt: new Date(),
      updatesUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      active: true,
    },
  });

  console.log('Created test license:', license.bundleId, `(active: ${license.active})`);

  // Create default admin user
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@bglocation.dev' },
    update: {},
    create: {
      email: 'admin@bglocation.dev',
      name: 'Admin',
    },
  });

  console.log('Created admin user:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
