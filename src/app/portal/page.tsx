import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { DashboardContent } from './dashboard-content';

export const metadata: Metadata = {
  title: 'Dashboard — License Portal',
  robots: { index: false, follow: false },
};

function getRenewalCheckoutUrl(plan: string): string | null {
  const envKey = `NEXT_PUBLIC_LS_CHECKOUT_URL_RENEWAL_${plan.toUpperCase()}`;
  const url = process.env[envKey];
  if (!url) return null;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}embed=1`;
}

export default async function PortalDashboard() {
  const session = await getSession();
  if (!session) redirect('/portal/login');

  const customer = await prisma.customer.findUnique({
    where: { id: session.customerId },
    include: {
      licenses: {
        where: { active: true },
        orderBy: { issuedAt: 'desc' },
      },
    },
  });

  if (!customer) redirect('/portal/login');

  const renewalCheckoutUrl = getRenewalCheckoutUrl(customer.plan);

  return (
    <DashboardContent
      email={customer.email}
      plan={customer.plan}
      maxBundleIds={customer.maxBundleIds}
      renewalCheckoutUrl={renewalCheckoutUrl}
      licenses={customer.licenses.map((l) => ({
        id: l.id,
        bundleId: l.bundleId,
        licenseKey: l.licenseKey,
        issuedAt: l.issuedAt.toISOString(),
        updatesUntil: l.updatesUntil.toISOString(),
      }))}
    />
  );
}
