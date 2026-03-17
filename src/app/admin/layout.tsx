import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { AdminShell } from './admin-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Layout wraps all /admin/* pages. Login/verify pages don't need the shell.
  // We detect auth pages by absence of session + relying on middleware.
  // If session exists, render the shell. Otherwise render children directly (login/verify).
  if (!session) {
    return <>{children}</>;
  }

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
