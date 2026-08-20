import React from 'react';
import { RiskSignal } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/design-system';
import { AlertCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export const RiskSignalCard: React.FC<{ signal: RiskSignal }> = ({ signal }) => {
  return (
    <Card className="border border-slate-200 bg-white shadow-subtle p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-slate-900">{signal.label}</h4>
          <span className="text-[11px] text-slate-500 font-mono">Category: {signal.category}</span>
        </div>
        <Badge
          variant={signal.category === 'HIGH' || signal.category === 'CRITICAL' ? 'critical' : 'low'}
          size="sm"
        >
          {signal.category}
        </Badge>
      </div>

      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-200/60 leading-relaxed font-medium">
        {signal.clinicalSignificance}
      </p>

      {/* Contributing Parameters */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          Correlated Parameters
        </span>
        <div className="flex flex-wrap gap-1">
          {signal.contributingParameterNames.map((name) => (
            <span
              key={name}
              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {signal.uncertaintyNote && (
        <div className="text-[11px] text-slate-500 italic flex items-start gap-1.5 pt-1 border-t border-slate-100">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{signal.uncertaintyNote}</span>
        </div>
      )}
    </Card>
  );
};
