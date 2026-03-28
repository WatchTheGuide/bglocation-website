'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  plan: string;
  maxBundleIds: number;
  licensesCount: number;
  ordersCount: number;
  createdAt: string;
  lastOrderAt: string | null;
}

interface CustomerListProps {
  customers: Customer[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  search: string;
  planFilter: string;
  sortField: string;
  sortOrder: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function CustomerList({
  customers,
  totalCount,
  totalPages,
  currentPage,
  search,
  planFilter,
  sortField,
  sortOrder,
}: CustomerListProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const [searchInput, setSearchInput] = useState(search);
  const [isPending, startTransition] = useTransition();

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParamsHook.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    // Reset to page 1 when filters change
    if (!updates.page) {
      params.delete('page');
    }
    startTransition(() => {
      router.push(`/admin/customers?${params.toString()}`);
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

  function handlePlanFilter(plan: string) {
    updateParams({ plan: plan === planFilter ? '' : plan });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <span className="text-sm text-muted-foreground">
          {totalCount} total
        </span>
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
          {['indie', 'team', 'factory', 'enterprise'].map((plan) => (
            <Button
              key={plan}
              variant={planFilter === plan ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePlanFilter(plan)}
              className="capitalize"
            >
              {plan}
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
                  label="Plan"
                  field="plan"
                  currentSort={sortField}
                  currentOrder={sortOrder}
                  onSort={handleSort}
                />
                <TableHead>Licenses</TableHead>
                <TableHead>Orders</TableHead>
                <SortableHead
                  label="Registered"
                  field="createdAt"
                  currentSort={sortField}
                  currentOrder={sortOrder}
                  onSort={handleSort}
                />
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {c.email}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{c.plan}</span>
                    </TableCell>
                    <TableCell>
                      {c.licensesCount} / {c.maxBundleIds === 0 ? '∞' : c.maxBundleIds}
                    </TableCell>
                    <TableCell>{c.ordersCount}</TableCell>
                    <TableCell>{formatDate(c.createdAt)}</TableCell>
                    <TableCell>
                      {c.lastOrderAt ? formatDate(c.lastOrderAt) : '—'}
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
        <ArrowUpDown className={`h-3 w-3 ${isActive ? 'text-foreground' : 'text-muted-foreground/50'}`} />
        {isActive && (
          <span className="text-xs">{currentOrder === 'asc' ? '↑' : '↓'}</span>
        )}
      </button>
    </TableHead>
  );
}
