import React from 'react';
import { motion } from 'framer-motion';
import { AbnormalityStatus } from '@/types';
import { cn } from '@/lib/utils';

export interface NormalRangeBarProps {
  value: number | string;
  min?: number;
  max?: number;
  status: AbnormalityStatus;
  unit: string;
}

export const NormalRangeBar: React.FC<NormalRangeBarProps> = ({ value, min, max, status, unit }) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.]/g, ''));

  if (isNaN(numericValue) || min === undefined || max === undefined || min >= max) {
    return (
      <span className="text-xs font-mono font-medium text-slate-700">
        {value} <span className="text-slate-400">{unit}</span>
      </span>
    );
  }

  // Calculate percentage along the gauge: min is at 30%, max is at 70%
  const range = max - min;
  const lowerBuffer = min - range * 0.5;
  const upperBuffer = max + range * 0.5;
  const totalSpan = upperBuffer - lowerBuffer;

  const rawPercent = ((numericValue - lowerBuffer) / totalSpan) * 100;
  const clampedPercent = Math.min(95, Math.max(5, rawPercent));

  const statusColors = {
    NORMAL: 'bg-emerald-500 ring-emerald-200',
    LOW: 'bg-amber-500 ring-amber-200',
    HIGH: 'bg-orange-500 ring-orange-200',
    CRITICAL_LOW: 'bg-red-600 ring-red-200',
    CRITICAL_HIGH: 'bg-red-600 ring-red-200',
    INCONCLUSIVE: 'bg-purple-500 ring-purple-200',
  };

  return (
    <div className="w-36 space-y-1">
      {/* Multi-segment Gauge Track with subtle physiological gradient */}
      <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        {/* Low Zone (0% to 30%) */}
        <div className="w-[30%] bg-amber-100/90" />
        {/* Normal Safe Zone (30% to 70%) */}
        <div className="w-[40%] bg-emerald-100 border-x border-emerald-300/40" />
        {/* High Zone (70% to 100%) */}
        <div className="w-[30%] bg-orange-100/90" />

        {/* Animated Marker Indicator Needle */}
        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: `calc(${clampedPercent}% - 5px)` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'absolute top-0 bottom-0 w-2.5 rounded-full ring-2 shadow-xs',
            statusColors[status] || statusColors.NORMAL
          )}
          title={`Observed: ${numericValue} ${unit} (Standard: ${min} - ${max} ${unit})`}
        />
      </div>

      {/* Min / Max Labels */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>{min}</span>
        <span className="text-[9px] text-emerald-600/80 font-medium font-sans">Normal</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
