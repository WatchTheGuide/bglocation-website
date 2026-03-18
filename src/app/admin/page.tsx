import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, KeyRound, ShoppingCart, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard — Admin Panel',
};

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let totalCustomers = 0;
  let customersByPlan: { plan: string; _count: { id: number } }[] = [];
  let totalActiveLicenses = 0;
  let expiredLicenses = 0;
  let totalOrders = 0;
  let ordersByType: { type: string; _count: { id: number } }[] = [];
  let recentCustomers = 0;

  try {
    [totalCustomers, customersByPlan, totalActiveLicenses, expiredLicenses, totalOrders, ordersByType, recentCustomers] =
      await Promise.all([
        prisma.customer.count(),
        prisma.customer.groupBy({
          by: ['plan'],
          _count: { id: true },
          orderBy: { plan: 'asc' },
        }),
        prisma.license.count({ where: { active: true } }),
        prisma.license.count({ where: { updatesUntil: { lt: now } } }),
        prisma.order.count(),
        prisma.order.groupBy({
          by: ['type'],
          _count: { id: true },
        }),
        prisma.customer.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      ]);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }

  const purchaseCount =
    ordersByType.find((o) => o.type === 'purchase')?._count.id ?? 0;
  const renewalCount =
    ordersByType.find((o) => o.type === 'renewal')?._count.id ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Active Licenses"
          value={totalActiveLicenses}
          icon={<KeyRound className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="New Customers (30d)"
          value={recentCustomers}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Breakdown cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customers by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customersByPlan.map((item) => (
                <div key={item.plan} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{item.plan}</span>
                  <span className="text-sm font-medium">{item._count.id}</span>
                </div>
              ))}
              {customersByPlan.length === 0 && (
                <p className="text-sm text-muted-foreground">No customers yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders & Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Purchases</span>
                <span className="text-sm font-medium">{purchaseCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Renewals</span>
                <span className="text-sm font-medium">{renewalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Expired update licenses</span>
                <span className="text-sm font-medium">{expiredLicenses}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
