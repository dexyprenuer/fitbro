import { redirect } from 'next/navigation';
import { requireAdmin, AdminAuthError } from '@/lib/auth';
import { AdminNav } from '@/components/admin/AdminNav';

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
      <AdminNav />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}