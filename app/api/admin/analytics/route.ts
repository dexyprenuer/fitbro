// app/api/admin/analytics/route.ts
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

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [daily, weekly, monthly, presetUsage, last14Days] = await Promise.all([
    prisma.workoutLog.count({
      where: { status: 'COMPLETED', completedDate: { gte: startOfToday } },
    }),
    prisma.workoutLog.count({
      where: { status: 'COMPLETED', completedDate: { gte: sevenDaysAgo } },
    }),
    prisma.workoutLog.count({
      where: { status: 'COMPLETED', completedDate: { gte: startOfMonth } },
    }),
    // Most-used routine: join through workoutDay -> routine, group by routine.
    prisma.workoutLog.groupBy({
      by: ['workoutDayId'],
      where: { status: 'COMPLETED', completedDate: { gte: thirtyDaysAgo } },
      _count: { _all: true },
      orderBy: { _count: { workoutDayId: 'desc' } },
      take: 20,
    }),
    // Daily completed-workout counts for the last 14 days, for a trend chart.
    prisma.workoutLog.findMany({
      where: { status: 'COMPLETED', completedDate: { gte: new Date(startOfToday.getTime() - 13 * 24 * 60 * 60 * 1000) } },
      select: { completedDate: true },
    }),
  ]);

  // Resolve workoutDay -> routine name for the "most used routine" ranking.
  const dayIds = presetUsage.map((p) => p.workoutDayId);
  const days = await prisma.workoutDay.findMany({
    where: { id: { in: dayIds } },
    select: { id: true, title: true, routine: { select: { id: true, name: true } } },
  });
  const dayInfo = new Map(days.map((d) => [d.id, d]));

  const routineTotals = new Map<string, { name: string; count: number }>();
  for (const row of presetUsage) {
    const info = dayInfo.get(row.workoutDayId);
    if (!info) continue;
    const key = info.routine.id;
    const existing = routineTotals.get(key);
    if (existing) {
      existing.count += row._count._all;
    } else {
      routineTotals.set(key, { name: info.routine.name, count: row._count._all });
    }
  }
  const topRoutines = [...routineTotals.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Build a 14-day trend array, filling zero-days.
  const trendMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(startOfToday.getTime() - i * 24 * 60 * 60 * 1000);
    trendMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const log of last14Days) {
    if (!log.completedDate) continue;
    const key = new Date(log.completedDate).toISOString().slice(0, 10);
    if (trendMap.has(key)) {
      trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
    }
  }
  const trend = [...trendMap.entries()].map(([date, count]) => ({ date, count }));

  return NextResponse.json({
    daily,
    weekly,
    monthly,
    topRoutines,
    trend,
  });
}