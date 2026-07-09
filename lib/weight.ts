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