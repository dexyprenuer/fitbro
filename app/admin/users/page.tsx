'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Shield, Trash2, Users as UsersIcon } from 'lucide-react';

interface AdminUser {
  id: string;
  clerkUserId: string;
  username: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
  workoutLevel: string | null;
  fitnessGoal: string | null;
  _count: { workoutLogs: number };
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-32 animate-pulse rounded-lg" style={{ background: 'var(--bg-secondary)' }} />
      <div className="h-11 animate-pulse rounded-[var(--radius-lg)]" style={{ background: 'var(--bg-secondary)' }} />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-[var(--radius-lg)]" style={{ background: 'var(--bg-secondary)' }} />
        ))}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (query: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/users${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load('');
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(q), 300);
    return () => clearTimeout(t);
  }, [q, load]);

  async function changeRole(user: AdminUser, role: AdminUser['role']) {
    setBusyId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      const { profile } = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: profile.role } : u)));
    }
    setBusyId(null);
  }

  async function deleteUser(user: AdminUser) {
    if (!confirm(`Delete ${user.username}? This cannot be undone.`)) return;
    setBusyId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    }
    setBusyId(null);
  }

  if (loading && users.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Users</h1>
        <p className="text-sm text-[var(--text-secondary)]">{users.length} shown</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by username..."
          className="w-full rounded-[var(--radius-lg)] py-2.5 pl-9 pr-4 text-sm outline-none transition-shadow focus:shadow-[var(--shadow-sm)]"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        />
      </div>

      {users.length === 0 && !loading ? (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] py-12 text-center"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: 'var(--accent-dim)' }}
          >
            <UsersIcon size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <p className="text-sm font-medium text-[var(--text-primary)]">No users found</p>
          {q && <p className="text-xs text-[var(--text-secondary)]">Try a different search term.</p>}
        </div>
      ) : (
        <div
          className="divide-y divide-[var(--border)] rounded-[var(--radius-lg)]"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <AnimatePresence initial={false}>
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{
                      background:
                        user.role === 'SUPER_ADMIN'
                          ? 'var(--warning-dim)'
                          : user.role === 'ADMIN'
                          ? 'var(--accent-dim)'
                          : 'var(--bg-secondary)',
                      color:
                        user.role === 'SUPER_ADMIN'
                          ? 'var(--warning)'
                          : user.role === 'ADMIN'
                          ? 'var(--accent)'
                          : 'var(--text-secondary)',
                    }}
                  >
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{user.username}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {user.role} · {user._count.workoutLogs} workouts logged
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.role !== 'ADMIN' && (
                    <button
                      disabled={busyId === user.id}
                      onClick={() => changeRole(user, 'ADMIN')}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-opacity disabled:opacity-50"
                      style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                    >
                      <ShieldCheck size={13} /> Make Admin
                    </button>
                  )}
                  {user.role !== 'USER' && (
                    <button
                      disabled={busyId === user.id}
                      onClick={() => changeRole(user, 'USER')}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-opacity disabled:opacity-50"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                    >
                      <Shield size={13} /> Demote
                    </button>
                  )}
                  <button
                    disabled={busyId === user.id}
                    onClick={() => deleteUser(user)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-opacity disabled:opacity-50"
                    style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}