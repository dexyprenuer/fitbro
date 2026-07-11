import { redirect } from 'next/navigation';
import { requireAdmin, AdminAuthError } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      redirect('/');
    }
    throw err;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-semibold text-[var(--text-primary)]">
            FitBro Admin
          </Link>
          <nav className="flex gap-5 text-sm text-[var(--text-secondary)]">
            <Link href="/admin" className="hover:text-[var(--text-primary)]">Dashboard</Link>
            <Link href="/admin/analytics" className="hover:text-[var(--text-primary)]">Analytics</Link>
            <Link href="/admin/users" className="hover:text-[var(--text-primary)]">Users</Link>
            <Link href="/admin/presets" className="hover:text-[var(--text-primary)]">Presets</Link>
            <Link href="/" className="hover:text-[var(--text-primary)]">← Back to App</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}