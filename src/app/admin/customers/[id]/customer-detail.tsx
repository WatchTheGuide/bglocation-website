'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toggleLicenseActiveAction } from '../../actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  KeyRound,
  ShoppingCart,
  User,
} from 'lucide-react';

interface CustomerInfo {
  id: string;
  email: string;
  plan: string;
  maxBundleIds: number;
  lsCustomerId: string;
  createdAt: string;
}

interface LicenseInfo {
  id: string;
  bundleId: string;
  issuedAt: string;
  updatesUntil: string;
  active: boolean;
}

interface OrderInfo {
  id: string;
  lsOrderId: string;
  type: string;
  createdAt: string;
}

interface CustomerDetailProps {
  customer: CustomerInfo;
  licenses: LicenseInfo[];
  orders: OrderInfo[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function CustomerDetail({
  customer,
  licenses,
  orders,
}: CustomerDetailProps) {
  const router = useRouter();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleToggle(licenseId: string, newActive: boolean) {
    setTogglingId(licenseId);
    await toggleLicenseActiveAction(licenseId, newActive);
    router.refresh();
    setTogglingId(null);
  }

  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">{customer.email}</h1>
      </div>

      {/* Customer info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="text-sm font-medium">{customer.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Plan</dt>
              <dd className="text-sm font-medium capitalize">{customer.plan}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Bundle ID Slots</dt>
              <dd className="text-sm font-medium">
                {customer.maxBundleIds === 0 ? 'Unlimited' : customer.maxBundleIds}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Registered</dt>
              <dd className="text-sm font-medium">{formatDate(customer.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Lemon Squeezy ID</dt>
              <dd className="font-mono text-xs">{customer.lsCustomerId}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Licenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Licenses
          </CardTitle>
          <CardDescription>
            {licenses.length} license{licenses.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bundle ID</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Updates Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No licenses generated.
                  </TableCell>
                </TableRow>
              ) : (
                licenses.map((l) => {
                  const updatesExpired = new Date(l.updatesUntil) < now;
                  return (
                    <TableRow key={l.id}>
                      <TableCell className="font-mono text-sm">
                        {l.bundleId}
                      </TableCell>
                      <TableCell>{formatDate(l.issuedAt)}</TableCell>
                      <TableCell>
                        <span className={updatesExpired ? 'text-destructive' : ''}>
                          {formatDate(l.updatesUntil)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {l.active ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={l.active ? 'destructive' : 'default'}
                          size="sm"
                          disabled={togglingId === l.id}
                          onClick={() => handleToggle(l.id, !l.active)}
                        >
                          {togglingId === l.id
                            ? '...'
                            : l.active
                              ? 'Deactivate'
                              : 'Activate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order History
          </CardTitle>
          <CardDescription>
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Lemon Squeezy Order ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{formatDate(o.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={o.type === 'purchase' ? 'default' : 'secondary'}>
                        {o.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {o.lsOrderId}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
