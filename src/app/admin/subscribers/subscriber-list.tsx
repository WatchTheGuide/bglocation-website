'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Users,
  CheckCircle,
  Clock,
  UserX,
} from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  status: string;
  platforms: string[];
  source: string;
  createdAt: string;
  confirmedAt: string | null;
}

interface SubscriberListProps {
  subscribers: Subscriber[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  search: string;
  statusFilter: string;
  platformFilter: string;
  sortField: string;
  sortOrder: string;
  statusCounts: {
    total: number;
    confirmed: number;
    pending: number;
    unsubscribed: number;
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const STATUS_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'default',
  pending: 'secondary',
  unsubscribed: 'outline',
};

export function SubscriberList({
  subscribers,
  totalCount,
  totalPages,
  currentPage,
  search,
  statusFilter,
  platformFilter,
  sortField,
  sortOrder,
  statusCounts,
}: SubscriberListProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const [searchInput, setSearchInput] = useState(search);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParamsHook.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    if (!updates.page) {
      params.delete('page');
    }
    startTransition(() => {
      router.push(`/admin/subscribers?${params.toString()}`);
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ search: searchInput });
  }

  function handleSort(field: string) {
    const newOrder =
      sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    updateParams({ sort: field, order: newOrder });
  }

  function handleStatusFilter(status: string) {
    updateParams({ status: status === statusFilter ? '' : status });
  }

  function handlePlatformFilter(platform: string) {
    updateParams({ platform: platform === platformFilter ? '' : platform });
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error ?? 'Failed to delete subscriber.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Subscribers</h1>
        <span className="text-sm text-muted-foreground">
          {totalCount} matching
        </span>
      </div>

      {/* KPI counters */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard title="Total" value={statusCounts.total} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Confirmed" value={statusCounts.confirmed} icon={<CheckCircle className="h-4 w-4 text-green-600" />} />
        <StatCard title="Pending" value={statusCounts.pending} icon={<Clock className="h-4 w-4 text-yellow-600" />} />
        <StatCard title="Unsubscribed" value={statusCounts.unsubscribed} icon={<UserX className="h-4 w-4 text-muted-foreground" />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="w-64 pl-8"
              placeholder="Search by email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" disabled={isPending}>
            Search
          </Button>
        </form>

        <div className="flex gap-1">
          {['confirmed', 'pending', 'unsubscribed'].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter(s)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>

        <div className="flex gap-1">
          {['capacitor', 'react-native', 'flutter', 'kmp'].map((p) => (
            <Button
              key={p}
              variant={platformFilter === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePlatformFilter(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead
                  label="Email"
                  field="email"
                  currentSort={sortField}
                  currentOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableHead
                  label="Status"
                  field="status"
                  currentSort={sortField}
                  currentOrder={sortOrder}
                  onSort={handleSort}
                />
                <TableHead>Platforms</TableHead>
                <TableHead>Source</TableHead>
                <SortableHead
                  label="Subscribed"
                  field="createdAt"
                  currentSort={sortField}
                  currentOrder={sortOrder}
                  onSort={handleSort}
                />
                <TableHead>Confirmed</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No subscribers found.
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.email}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_BADGE_VARIANT[s.status] ?? 'secondary'} className="capitalize">
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {s.platforms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {s.platforms.map((p) => (
                            <Badge key={p} variant="outline" className="text-xs">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">all</span>
                      )}
                    </TableCell>
                    <TableCell className="capitalize">{s.source}</TableCell>
                    <TableCell>{formatDate(s.createdAt)}</TableCell>
                    <TableCell>
                      {s.confirmedAt ? formatDate(s.confirmedAt) : '—'}
                    </TableCell>
                    <TableCell>
                      <DeleteButton
                        subscriberId={s.id}
                        email={s.email}
                        isDeleting={deletingId === s.id}
                        onDelete={handleDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => updateParams({ page: String(currentPage - 1) })}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => updateParams({ page: String(currentPage + 1) })}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
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

function SortableHead({
  label,
  field,
  currentSort,
  currentOrder,
  onSort,
}: {
  label: string;
  field: string;
  currentSort: string;
  currentOrder: string;
  onSort: (f: string) => void;
}) {
  const isActive = currentSort === field;
  return (
    <TableHead>
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => onSort(field)}
      >
        {label}
        <ArrowUpDown
          className={`h-3 w-3 ${isActive ? 'text-foreground' : 'text-muted-foreground/50'}`}
        />
        {isActive && (
          <span className="text-xs">{currentOrder === 'asc' ? '↑' : '↓'}</span>
        )}
      </button>
    </TableHead>
  );
}

function DeleteButton({
  subscriberId,
  email,
  isDeleting,
  onDelete,
}: {
  subscriberId: string;
  email: string;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-xs" disabled={isDeleting} />
        }
      >
        <Trash2 className="h-3.5 w-3.5 text-destructive" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete subscriber</DialogTitle>
          <DialogDescription>
            Permanently delete <strong>{email}</strong> and all associated data?
            This action cannot be undone (GDPR Art. 17).
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => onDelete(subscriberId)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
