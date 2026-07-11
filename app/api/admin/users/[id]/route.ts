// app/api/admin/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClerkClient } from '@clerk/backend';
import { prisma } from '@/lib/prisma';
import { requireAdmin, requireSuperAdmin, AdminAuthError } from '@/lib/auth';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

interface RoleBody {
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

// PATCH: change role. Promoting/demoting to or from ADMIN/SUPER_ADMIN requires super admin.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  let body: RoleBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.role || !['USER', 'ADMIN', 'SUPER_ADMIN'].includes(body.role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  try {
    // Only super admins can grant/revoke ADMIN or SUPER_ADMIN roles.
    // A plain admin calling this at all is already blocked by requireAdmin below
    // for read access, but role changes need the stricter check.
    await requireSuperAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  const target = await prisma.profile.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const updated = await prisma.profile.update({
    where: { id: params.id },
    data: { role: body.role },
  });

  // Keep Clerk publicMetadata in sync so the session claim reflects the new role
  // on the target user's next token refresh.
  const clerkUser = await clerk.users.getUser(target.clerkUserId);
  await clerk.users.updateUserMetadata(target.clerkUserId, {
    publicMetadata: {
      ...clerkUser.publicMetadata,
      role: body.role,
    },
  });

  return NextResponse.json({ profile: updated });
}

// DELETE: remove a user's profile (and cascaded data) entirely.
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await requireSuperAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  const target = await prisma.profile.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await prisma.profile.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}