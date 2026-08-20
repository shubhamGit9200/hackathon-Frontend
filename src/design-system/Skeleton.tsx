import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200/80',
        variant === 'text' && 'h-4 rounded-md w-3/4',
        variant === 'rectangular' && 'rounded-lg',
        variant === 'circular' && 'rounded-full',
        className
      )}
      {...props}
    />
  );
};
