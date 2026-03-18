'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateKeyAction, renewKeyAction, logoutAction, type GenerateKeyState } from './actions';
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
  Shield,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface License {
  id: string;
  bundleId: string;
  licenseKey: string;
  issuedAt: string;
  updatesUntil: string;
}

interface DashboardContentProps {
  email: string;
  plan: string;
  maxBundleIds: number;
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
  plan,
  maxBundleIds,
  licenses,
}: DashboardContentProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generateKey, setGenerateKey] = useState(0);
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [renewError, setRenewError] = useState<string | null>(null);

  const slotsUsed = licenses.length;
  const slotsText =
    maxBundleIds === 0
      ? `${slotsUsed} / unlimited`
      : `${slotsUsed} / ${maxBundleIds}`;
  const canGenerate = maxBundleIds === 0 || slotsUsed < maxBundleIds;
  const now = new Date();

  async function copyKey(id: string, key: string) {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleRenew(licenseId: string) {
    setRenewingId(licenseId);
    setRenewError(null);
    const result = await renewKeyAction(licenseId);
    if (result?.error) {
      setRenewError(result.error);
    } else {
      router.refresh();
    }
    setRenewingId(null);
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

      {/* Plan info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
          </CardTitle>
          <CardDescription>Bundle IDs: {slotsText}</CardDescription>
        </CardHeader>
      </Card>

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
      {renewError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{renewError}</AlertDescription>
        </Alert>
      )}
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
                  <TableHead className="w-25"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenses.map((license) => {
                  const updatesExpired = new Date(license.updatesUntil) < now;
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
                          {new Date(license.updatesUntil).toLocaleDateString()}
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
                      <TableCell>
                        {updatesExpired && (
                          <Button
                            variant="outline"
                            size="xs"
                            disabled={renewingId === license.id}
                            onClick={() => handleRenew(license.id)}
                          >
                            <RefreshCw className={`mr-1 h-3 w-3 ${renewingId === license.id ? 'animate-spin' : ''}`} />
                            {renewingId === license.id ? 'Renewing...' : 'Renew'}
                          </Button>
                        )}
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
