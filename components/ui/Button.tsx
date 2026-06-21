'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success';
type ButtonSize   = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  fullWidth?: boolean;
  loading?:  boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background:  'var(--accent)',
    color:       '#fff',
    boxShadow:   '0 4px 20px var(--accent-glow), 0 1px 0 rgba(255,255,255,0.12) inset',
  },
  secondary: {
    background:  'var(--glass)',
    color:       'var(--text-primary)',
    border:      '1px solid var(--glass-border-strong)',
    backdropFilter: 'blur(20px) saturate(160%)',
    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  },
  ghost: {
    background:  'transparent',
    color:       'var(--text-secondary)',
  },
  destructive: {
    background:  'var(--destructive-dim)',
    color:       'var(--destructive)',
    border:      '1px solid rgba(248,113,113,0.22)',
  },
  success: {
    background:  'var(--success-dim)',
    color:       'var(--success)',
    border:      '1px solid rgba(52,211,153,0.22)',
  },
};

/* Use CSS-var radius tokens — no hardcoded Tailwind radius classes */
const sizeStyles: Record<ButtonSize, React.CSSProperties & { className: string }> = {
  sm: {
    className:   'px-3.5 py-2 text-sm gap-1.5',
    borderRadius: 'var(--radius-sm)',
    minHeight:   '36px',
  },
  md: {
    className:   'px-5 py-2.5 text-sm gap-2',
    borderRadius: 'var(--radius-md)',
    minHeight:   '42px',
  },
  lg: {
    className:   'px-6 py-3.5 text-base gap-2',
    borderRadius: 'var(--radius-lg)',
    minHeight:   '50px',
  },
  xl: {
    className:   'px-8 py-4 text-base gap-2.5',
    borderRadius: 'var(--radius-xl)',
    minHeight:   '56px',
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant   = 'primary',
      size      = 'md',
      fullWidth = false,
      loading   = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const { className: sizeClass, ...sizeStyle } = sizeStyles[size];

    return (
      <motion.button
        ref={ref}
        /* Scale tap — no hover scale on mobile (saves animation budget) */
        whileTap={isDisabled ? {} : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        disabled={isDisabled}
        className={cn(
          'relative inline-flex items-center justify-center font-semibold font-display',
          'select-none transition-opacity duration-150 tap-target',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
          sizeClass,
          fullWidth && 'w-full',
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        style={{
          ...variantStyles[variant],
          ...sizeStyle,
          ...style,
        }}
        {...props}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {leftIcon  && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

function Spinner() {
  return (
    <svg
      className="animate-spin w-[18px] h-[18px]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}