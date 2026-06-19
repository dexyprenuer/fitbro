import { cn } from '@/lib/utils';

type GlassCardVariant = 'default' | 'elevated' | 'interactive' | 'accent' | 'success';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: GlassCardVariant;
  /** Removes padding for custom layouts */
  noPad?: boolean;
}

const variantStyles: Record<GlassCardVariant, React.CSSProperties> = {
  default: {
    background: 'var(--glass)',
    borderColor: 'var(--glass-border)',
    boxShadow: 'var(--shadow)',
  },
  elevated: {
    background: 'var(--glass-heavy)',
    borderColor: 'var(--glass-border-strong)',
    boxShadow: 'var(--shadow-lg)',
  },
  interactive: {
    background: 'var(--card)',
    borderColor: 'var(--glass-border)',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
  },
  accent: {
    background: 'linear-gradient(135deg, var(--accent-dim) 0%, var(--glass) 100%)',
    borderColor: 'var(--accent-dim)',
    boxShadow: 'var(--shadow)',
  },
  success: {
    background: 'linear-gradient(135deg, var(--success-dim) 0%, var(--glass) 100%)',
    borderColor: 'var(--success-dim)',
    boxShadow: 'var(--shadow)',
  },
};

export function GlassCard({
  children,
  className,
  variant = 'default',
  noPad = false,
  style,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border backdrop-blur-xl',
        !noPad && 'p-4',
        className
      )}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </div>
  );
}