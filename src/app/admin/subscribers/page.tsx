import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { SubscriberList } from './subscriber-list';

export const metadata: Metadata = {
  title: 'Subscribers — Admin Panel',
};

const PAGE_SIZE = 20;

export default async function SubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    platform?: string;
    sort?: string;
    order?: string;
    page?: string;
  }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const params = await searchParams;
  const search = params.search?.trim() ?? '';
  const statusFilter = params.status ?? '';
  const platformFilter = params.platform ?? '';
  const sortField = params.sort ?? 'createdAt';
  const sortOrder = params.order === 'asc' ? 'asc' : 'desc';
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const where: Record<string, unknown> = {};
  if (search) {
    where.email = { contains: search, mode: 'insensitive' };
  }
  if (statusFilter && ['pending', 'confirmed', 'unsubscribed'].includes(statusFilter)) {
    where.status = statusFilter;
  }
  if (platformFilter && ['capacitor', 'react-native', 'flutter', 'kmp'].includes(platformFilter)) {
    where.platforms = { has: platformFilter };
  }

  const validSortFields = ['email', 'status', 'createdAt'];
  const orderByField = validSortFields.includes(sortField) ? sortField : 'createdAt';

  let subscribers: {
    id: string;
    email: string;
    status: string;
    platforms: string[];
    source: string;
    createdAt: string;
    confirmedAt: string | null;
  }[] = [];
  let totalCount = 0;
  let statusCounts = { total: 0, confirmed: 0, pending: 0, unsubscribed: 0 };

  try {
    const [rows, count, confirmed, pending, unsubscribed] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { [orderByField]: sortOrder },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          email: true,
          status: true,
          platforms: true,
          source: true,
          createdAt: true,
          confirmedAt: true,
        },
      }),
      prisma.subscriber.count({ where }),
      prisma.subscriber.count({ where: { AND: [where, { status: 'confirmed' }] } }),
      prisma.subscriber.count({ where: { AND: [where, { status: 'pending' }] } }),
      prisma.subscriber.count({ where: { AND: [where, { status: 'unsubscribed' }] } }),
    ]);

    subscribers = rows.map((s) => ({
      id: s.id,
      email: s.email,
      status: s.status,
      platforms: s.platforms,
      source: s.source,
      createdAt: s.createdAt.toISOString(),
      confirmedAt: s.confirmedAt?.toISOString() ?? null,
    }));
    totalCount = count;
    statusCounts = {
      total: confirmed + pending + unsubscribed,
      confirmed,
      pending,
      unsubscribed,
    };
  } catch (error) {
    console.error('Failed to load subscribers:', error);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <SubscriberList
      subscribers={subscribers}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={page}
      search={search}
      statusFilter={statusFilter}
      platformFilter={platformFilter}
      sortField={orderByField}
      sortOrder={sortOrder}
      statusCounts={statusCounts}
    />
  );
}
