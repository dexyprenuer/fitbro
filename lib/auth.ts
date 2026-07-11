// lib/auth.ts
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export type AppRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

/**
 * Reads role from the Clerk session claim (no DB round-trip).
 * Returns null if not signed in or no role claim present.
 */
export function getSessionRole(): AppRole | null {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: AppRole } | undefined)?.role;
  return role ?? null;
}

/**
 * Server-side guard for API routes and Server Components.
 * Throws a 404-shaped error object if the user isn't ADMIN or SUPER_ADMIN.
 * Per security spec: unauthorized access returns 404, never 401/403,
 * to avoid revealing the existence of admin routes.
 */
export async function requireAdmin() {
  const { userId } = auth();
  if (!userId) {
    throw new AdminAuthError();
  }

  const sessionRole = getSessionRole();

  // Fast path: trust session claim if present.
  if (sessionRole === 'ADMIN' || sessionRole === 'SUPER_ADMIN') {
    return { userId, role: sessionRole };
  }

  // Slow path fallback: session claim missing/stale, verify against DB.
  // (Covers the window right after a promotion, before the user's
  // session token refreshes with the new claim.)
  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
    select: { role: true },
  });

  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN')) {
    throw new AdminAuthError();
  }

  return { userId, role: profile.role };
}

/**
 * Stricter guard for super-admin-only actions (e.g. promoting other admins).
 */
export async function requireSuperAdmin() {
  const { userId, role } = await requireAdmin();
  if (role !== 'SUPER_ADMIN') {
    throw new AdminAuthError();
  }
  return { userId, role };
}

export class AdminAuthError extends Error {
  constructor() {
    super('Not found');
    this.name = 'AdminAuthError';
  }
}