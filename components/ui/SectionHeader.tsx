import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ label, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between px-1 mb-2', className)}>
      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">
        {label}
      </p>
      {action && (
        <div className="text-xs text-[var(--accent)] font-medium">{action}</div>
      )}
    </div>
  );
}