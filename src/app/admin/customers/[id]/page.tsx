import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { CustomerDetail } from './customer-detail';

export const metadata: Metadata = {
  title: 'Customer Details — Admin Panel',
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const { id } = await params;

  // Validate UUID format to prevent injection
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      licenses: {
        orderBy: { issuedAt: 'desc' },
      },
      orders: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <CustomerDetail
      customer={{
        id: customer.id,
        email: customer.email,
        plan: customer.plan,
        maxBundleIds: customer.maxBundleIds,
        lsCustomerId: customer.lsCustomerId,
        createdAt: customer.createdAt.toISOString(),
      }}
      licenses={customer.licenses.map((l) => ({
        id: l.id,
        bundleId: l.bundleId,
        issuedAt: l.issuedAt.toISOString(),
        updatesUntil: l.updatesUntil.toISOString(),
        active: l.active,
      }))}
      orders={customer.orders.map((o) => ({
        id: o.id,
        lsOrderId: o.lsOrderId,
        type: o.type,
        createdAt: o.createdAt.toISOString(),
      }))}
    />
  );
}
