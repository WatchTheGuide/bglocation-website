'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminLogoutAction } from './actions';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, LogOut, Shield } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/customers', label: 'Customers', icon: Users },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 px-4 py-6">
        <div className="mb-8 flex items-center gap-2 px-2">
          <Shield className="h-5 w-5" />
          <span className="text-lg font-semibold">BGLocation</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center justify-end border-b px-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{email}</span>
            <form action={adminLogoutAction}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="mr-1 h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
