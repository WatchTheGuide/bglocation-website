import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { CustomerList } from './customer-list';

export const metadata: Metadata = {
  title: 'Customers — Admin Panel',
};

const PAGE_SIZE = 20;

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    plan?: string;
    sort?: string;
    order?: string;
    page?: string;
  }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const params = await searchParams;
  const search = params.search?.trim() ?? '';
  const planFilter = params.plan ?? '';
  const sortField = params.sort ?? 'createdAt';
  const sortOrder = params.order === 'asc' ? 'asc' : 'desc';
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  // Build where clause
  const where: Record<string, unknown> = {};
  if (search) {
    where.email = { contains: search, mode: 'insensitive' };
  }
  if (planFilter && ['indie', 'team', 'factory', 'enterprise'].includes(planFilter)) {
    where.plan = planFilter;
  }

  // Build orderBy
  const validSortFields = ['email', 'plan', 'createdAt'];
  const orderByField = validSortFields.includes(sortField) ? sortField : 'createdAt';

  const [customers, totalCount] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { [orderByField]: sortOrder },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        _count: {
          select: {
            licenses: true,
            orders: true,
          },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const mappedCustomers = customers.map((c) => ({
    id: c.id,
    email: c.email,
    plan: c.plan,
    maxBundleIds: c.maxBundleIds,
    licensesCount: c._count.licenses,
    ordersCount: c._count.orders,
    createdAt: c.createdAt.toISOString(),
    lastOrderAt: c.orders[0]?.createdAt.toISOString() ?? null,
  }));

  return (
    <CustomerList
      customers={mappedCustomers}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={page}
      search={search}
      planFilter={planFilter}
      sortField={orderByField}
      sortOrder={sortOrder}
    />
  );
}
