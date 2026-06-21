import { cn } from '@/lib/utils';

type GlassCardVariant = 'default' | 'elevated' | 'interactive' | 'accent' | 'success';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: GlassCardVariant;
  noPad?: boolean;
}

const variantStyles: Record<GlassCardVariant, React.CSSProperties> = {
  default: {
    background: 'var(--glass)',
    borderColor: 'var(--glass-border)',
    boxShadow: 'var(--shadow-sm)',
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
    borderColor: 'rgba(108,99,255,0.18)',
    boxShadow: 'var(--shadow), 0 0 0 1px var(--accent-dim)',
  },
  success: {
    background: 'linear-gradient(135deg, var(--success-dim) 0%, var(--glass) 100%)',
    borderColor: 'rgba(52,211,153,0.18)',
    boxShadow: 'var(--shadow), 0 0 0 1px var(--success-dim)',
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
        'border backdrop-blur-xl',
        !noPad && 'p-4',
        className
      )}
      style={{
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        willChange: 'transform',
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}