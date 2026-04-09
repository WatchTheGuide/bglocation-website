'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateKeyAction, logoutAction, type GenerateKeyState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  KeyRound,
  Copy,
  Check,
  LogOut,
  Plus,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShoppingCart,
} from 'lucide-react';

interface License {
  id: string;
  bundleId: string;
  licenseKey: string;
  issuedAt: string;
  updatesUntil: string;
}

interface OrderInfo {
  id: string;
  lsOrderId: string;
  type: string;
  plan: string | null;
  maxBundleIds: number;
  createdAt: string;
}

interface DashboardContentProps {
  email: string;
  cachedMaxBundleIds: number;
  renewalCheckoutUrl: string | null;
  orders: OrderInfo[];
  licenses: License[];
}

interface GenerateKeySectionProps {
  canGenerate: boolean;
  onDone: () => void;
}

function GenerateKeySection({ canGenerate, onDone }: GenerateKeySectionProps) {
  const [state, action, pending] = useActionState<GenerateKeyState, FormData>(
    generateKeyAction,
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyNewKey(key: string) {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!showForm && !state?.success) {
    return (
      <div className="mb-6">
        <Button onClick={() => setShowForm(true)} disabled={!canGenerate}>
          <Plus className="mr-1 h-4 w-4" />
          Generate New Key
        </Button>
        {!canGenerate && (
          <p className="mt-2 text-sm text-muted-foreground">
            You&apos;ve reached the maximum number of bundle IDs for your plan.
          </p>
        )}
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Generate License Key
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state?.success ? (
          <div className="space-y-4">
            <Alert>
              <Check className="h-4 w-4" />
              <AlertTitle>Key generated for {state.bundleId}</AlertTitle>
              <AlertDescription>
                A backup has been sent to your email.
              </AlertDescription>
            </Alert>
            <div className="rounded-lg bg-muted p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium">License Key</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => copyNewKey(state.licenseKey!)}
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <code className="break-all font-mono text-xs">
                {state.licenseKey}
              </code>
            </div>
            <Button variant="outline" size="sm" onClick={onDone}>
              Done
            </Button>
          </div>
        ) : (
          <form action={action} className="space-y-4">
            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="bundleId">Bundle ID</Label>
              <Input
                id="bundleId"
                name="bundleId"
                placeholder="com.example.myapp"
                required
                autoFocus
                pattern="[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)+"
                title="Reverse-domain notation (e.g., com.example.app)"
              />
              <p className="text-xs text-muted-foreground">
                Use reverse-domain notation, e.g. com.example.myapp
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={pending}>
                {pending ? 'Generating...' : 'Generate Key'}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardContent({
  email,
  cachedMaxBundleIds,
  renewalCheckoutUrl,
  orders,
  licenses,
}: DashboardContentProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generateKey, setGenerateKey] = useState(0);

  // Calculate slots from purchase orders (only backfilled ones with plan set).
  // If any legacy orders have plan=null (not yet backfilled), fall back to
  // the cached customer.maxBundleIds to avoid blocking legitimate customers.
  const allPurchaseOrders = orders.filter((o) => o.type === 'purchase');
  const hasLegacyOrders = allPurchaseOrders.some((o) => o.plan === null);
  const backfilledOrders = allPurchaseOrders.filter((o) => o.plan !== null);
  const hasUnlimited = hasLegacyOrders
    ? cachedMaxBundleIds === 0
    : backfilledOrders.some((o) => o.maxBundleIds === 0);
  const totalSlots = hasUnlimited
    ? 0
    : hasLegacyOrders
      ? cachedMaxBundleIds
      : backfilledOrders.reduce((sum, o) => sum + o.maxBundleIds, 0);

  const slotsUsed = licenses.length;
  const hasSlots = hasUnlimited || totalSlots > 0;
  const slotsText = hasUnlimited
    ? `${slotsUsed} / unlimited`
    : `${slotsUsed} / ${totalSlots}`;
  const canGenerate = hasUnlimited || (hasSlots && slotsUsed < totalSlots);
  const now = new Date();

  const renewUrl = renewalCheckoutUrl
    ? `${renewalCheckoutUrl}&checkout[custom][customer_email]=${encodeURIComponent(email)}`
    : null;

  // Plan-level renewal: based on earliest updatesUntil across all licenses
  const earliestUpdatesUntil = licenses.length > 0
    ? new Date(Math.min(...licenses.map((l) => new Date(l.updatesUntil).getTime())))
    : null;
  const planExpired = earliestUpdatesUntil ? earliestUpdatesUntil < now : false;
  const daysUntilPlanExpiry = earliestUpdatesUntil
    ? Math.ceil((earliestUpdatesUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const showPlanRenew = planExpired || (daysUntilPlanExpiry !== null && daysUntilPlanExpiry <= 60);

  async function copyKey(id: string, key: string) {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">License Portal</h1>
          <p className="text-muted-foreground">{email}</p>
        </div>
        <form action={logoutAction}>
          <Button variant="outline" size="sm" type="submit">
            <LogOut className="mr-1 h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>

      {/* Purchases */}
      {allPurchaseOrders.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Purchases
                </CardTitle>
                <CardDescription className="mt-1.5">
                  {slotsText} bundle IDs used
                  {earliestUpdatesUntil && (
                    <>
                      {' · '}Updates until{' '}
                      <span className={planExpired ? 'text-destructive' : ''}>
                        {earliestUpdatesUntil.toLocaleDateString()}
                      </span>
                      {planExpired && (
                        <Badge variant="destructive" className="ml-2">
                          Expired
                        </Badge>
                      )}
                      {!planExpired && daysUntilPlanExpiry !== null && daysUntilPlanExpiry <= 60 && (
                        <Badge variant="secondary" className="ml-2">
                          Expires soon
                        </Badge>
                      )}
                    </>
                  )}
                </CardDescription>
              </div>
              {showPlanRenew && renewUrl && (
                <Button
                  render={
                    <a
                      href={renewUrl}
                      className="lemonsqueezy-button"
                    />
                  }
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="mr-1 h-4 w-4" />
                  Renew Updates
                </Button>
              )}
              {showPlanRenew && !renewUrl && (
                <Button
                  render={<a href="mailto:hello@bglocation.dev" />}
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Contact us
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Bundle IDs</TableHead>
                  <TableHead>Order ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPurchaseOrders.map((order: OrderInfo) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">
                      {order.plan ?? '—'}
                    </TableCell>
                    <TableCell>
                      {order.maxBundleIds === 0
                        ? 'Unlimited'
                        : order.maxBundleIds}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      #{order.lsOrderId}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Generate new key */}
      <GenerateKeySection
        key={generateKey}
        canGenerate={canGenerate}
        onDone={() => {
          setGenerateKey((k) => k + 1);
          router.refresh();
        }}
      />

      {/* Licenses table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Your Licenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {licenses.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No licenses generated yet. Click &quot;Generate New Key&quot; to
              get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bundle ID</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Updates Until</TableHead>
                  <TableHead className="w-25">Key</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenses.map((license) => {
                  const updatesUntilDate = new Date(license.updatesUntil);
                  const updatesExpired = updatesUntilDate < now;
                  return (
                    <TableRow key={license.id}>
                      <TableCell className="font-mono text-xs">
                        {license.bundleId}
                      </TableCell>
                      <TableCell>
                        {new Date(license.issuedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={updatesExpired ? 'text-destructive' : ''}>
                          {updatesUntilDate.toLocaleDateString()}
                        </span>
                        {updatesExpired && (
                          <Badge variant="destructive" className="ml-2">
                            Expired
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() =>
                            copyKey(license.id, license.licenseKey)
                          }
                        >
                          {copiedId === license.id ? (
                            <>
                              <Check className="mr-1 h-3 w-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1 h-3 w-3" />
                              Copy
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
