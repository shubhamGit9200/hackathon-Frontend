'use client';

import React, { useState } from 'react';
import { CLINICAL_SAFETY_DISCLAIMERS } from '@/constants';
import { ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      className={cn(
        'border-b bg-slate-50 border-slate-200 px-4 py-2 text-slate-600 select-none',
        compact ? 'text-[11px] py-1.5' : 'text-xs'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="font-semibold text-slate-800 shrink-0">Clinical Advisory:</span>
          <p className="text-slate-600 leading-snug line-clamp-1 md:line-clamp-none">
            {CLINICAL_SAFETY_DISCLAIMERS.generalBanner}
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors shrink-0"
          aria-label="Dismiss advisory banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
