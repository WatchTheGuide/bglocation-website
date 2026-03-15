import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
