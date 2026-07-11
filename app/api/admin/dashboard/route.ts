// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AdminAuthError } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, activeUsers, workoutCount, presetCount, recentLogs] = await Promise.all([
    prisma.profile.count(),
    prisma.profile.count({
      where: { workoutLogs: { some: { updatedAt: { gte: sevenDaysAgo } } } },
    }),
    prisma.workoutLog.count({ where: { status: 'COMPLETED' } }),
    prisma.routine.count({ where: { type: 'PRESET' } }),
    prisma.workoutLog.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { updatedAt: 'desc' },
      take: 8,
      select: {
        id: true,
        completedDate: true,
        durationSec: true,
        updatedAt: true,
        profile: { select: { username: true } },
        workoutDay: { select: { title: true } },
      },
    }),
  ]);

  return NextResponse.json({
    totalUsers,
    activeUsers,
    workoutCount,
    presetCount,
    recentActivity: recentLogs.map((log) => ({
      id: log.id,
      username: log.profile.username,
      workoutTitle: log.workoutDay.title,
      completedDate: log.completedDate,
      durationSec: log.durationSec,
      at: log.updatedAt,
    })),
  });
}