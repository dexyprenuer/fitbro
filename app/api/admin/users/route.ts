// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AdminAuthError } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();

  const users = await prisma.profile.findMany({
    where: q ? { username: { contains: q, mode: 'insensitive' } } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      clerkUserId: true,
      username: true,
      role: true,
      createdAt: true,
      workoutLevel: true,
      fitnessGoal: true,
      _count: { select: { workoutLogs: true } },
    },
  });

  return NextResponse.json({ users });
}