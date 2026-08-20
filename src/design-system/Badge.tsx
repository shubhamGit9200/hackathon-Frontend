import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'normal'
    | 'low'
    | 'high'
    | 'critical'
    | 'uncertain'
    | 'outline'
    | 'info';
  size?: 'sm' | 'md' | 'lg';
  withDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  withDot = false,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    normal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    low: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    critical: 'bg-red-50 text-red-700 border-red-200 font-medium',
    uncertain: 'bg-purple-50 text-purple-700 border-purple-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  const dots = {
    default: 'bg-slate-400',
    normal: 'bg-emerald-500',
    low: 'bg-amber-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
    uncertain: 'bg-purple-500',
    outline: 'bg-slate-400',
    info: 'bg-sky-500',
  };

  const sizes = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full select-none shrink-0 transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {withDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dots[variant])} />
      )}
      {children}
    </span>
  );
};
