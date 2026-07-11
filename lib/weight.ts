export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

export function formatWeight(kg: number, unit: 'KG' | 'LBS'): string {
  const val = unit === 'LBS' ? kgToLbs(kg) : kg;
  return val.toFixed(1);
}

export function unitLabel(unit: 'KG' | 'LBS'): string {
  return unit === 'LBS' ? 'lbs' : 'kg';
}

export interface WeightLogEntry {
  id: string;
  weightKg: number;
  loggedAt: string;
}

export function relativeDayLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const diffMs = new Date(today.toDateString()).getTime() - new Date(date.toDateString()).getTime();
  const diffDays = Math.round(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Graph helpers ──────────────────────────────────────────────

export interface GraphPoint {
  x: number;
  y: number;
  weightKg: number;
  loggedAt: string;
}

/**
 * Converts a sorted (oldest→newest) list of weight logs into normalized
 * 0–100 x / 0–40 y coordinates for the SVG viewBox, with ±0.5kg y-padding
 * so small fluctuations don't look like drastic jumps.
 */
export function buildGraphPoints(logs: WeightLogEntry[]): GraphPoint[] {
  if (logs.length === 0) return [];

  const w = 100;
  const h = 40;

  if (logs.length === 1) {
    return [{ x: w / 2, y: h / 2, weightKg: logs[0].weightKg, loggedAt: logs[0].loggedAt }];
  }

  const values = logs.map((l) => l.weightKg);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const min = rawMin - 0.5;
  const max = rawMax + 0.5;
  const range = max - min || 1;

  return logs.map((l, i) => ({
    x: (i / (logs.length - 1)) * w,
    y: h - ((l.weightKg - min) / range) * h,
    weightKg: l.weightKg,
    loggedAt: l.loggedAt,
  }));
}

/**
 * Builds a smooth cubic Bézier path through the given points using a
 * Catmull-Rom-to-Bézier conversion. Falls back to a straight line for 2 points.
 */
export function buildSmoothPath(points: GraphPoint[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  const d: string[] = [`M ${points[0].x} ${points[0].y}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }

  return d.join(' ');
}

/** Builds the closed area-fill path beneath a smooth line path. */
export function buildAreaPath(smoothPath: string, points: GraphPoint[]): string {
  if (!smoothPath || points.length < 2) return '';
  const w = 100;
  const h = 40;
  const last = points[points.length - 1];
  const first = points[0];
  return `${smoothPath} L ${last.x} ${h} L ${first.x} ${h} Z`;
}