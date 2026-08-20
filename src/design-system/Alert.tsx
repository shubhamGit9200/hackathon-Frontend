import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AlertProps {
  variant?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
  };

  const variants = {
    info: 'bg-sky-50/80 border-sky-200 text-sky-900',
    warning: 'bg-amber-50/80 border-amber-200 text-amber-900',
    error: 'bg-red-50/80 border-red-200 text-red-900',
    success: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
  };

  return (
    <div
      role="alert"
      className={cn(
        'p-4 rounded-xl border flex items-start gap-3 transition-all duration-150',
        variants[variant],
        className
      )}
    >
      {icons[variant]}
      <div className="flex-1 text-xs leading-relaxed">
        {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
