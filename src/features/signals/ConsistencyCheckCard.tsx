import React from 'react';
import { ConsistencyCheck } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/design-system';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ConsistencyCheckCard: React.FC<{ check: ConsistencyCheck }> = ({ check }) => {
  const resultVariants = {
    CONSISTENT: { badge: 'normal' as const, icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
    PHYSIOLOGICALLY_PLAUSIBLE: { badge: 'info' as const, icon: <ShieldCheck className="w-4 h-4 text-sky-600" /> },
    CONTRADICTORY: { badge: 'critical' as const, icon: <AlertTriangle className="w-4 h-4 text-red-600" /> },
    REQUIRES_RETEST: { badge: 'low' as const, icon: <AlertTriangle className="w-4 h-4 text-amber-600" /> },
  };

  const meta = resultVariants[check.result] || resultVariants.CONSISTENT;

  return (
    <Card className="border border-slate-200/90 shadow-card overflow-hidden">
      <CardHeader className="bg-slate-50/70 py-3.5 px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {meta.icon}
            <CardTitle className="text-sm font-bold text-slate-900">{check.title}</CardTitle>
          </div>
          <Badge variant={meta.badge} size="sm">
            {check.result.replace(/_/g, ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <p className="text-xs text-slate-600">{check.comparisonDescription}</p>

        {/* Parameters involved */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-700">Cross-Checked:</span>
          {check.contributingParameters.map((cp) => (
            <span key={cp.parameterName} className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-800 border">
              {cp.parameterName}: <span className="font-bold">{cp.value}</span>
            </span>
          ))}
        </div>

        {/* Explanation */}
        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed font-medium">
          {check.explanation}
        </p>

        {/* Recommendation */}
        <div className="text-[11px] text-slate-500 italic">
          <span className="font-semibold text-slate-700">Conclusion: </span>
          {check.recommendationNote}
        </div>
      </CardContent>
    </Card>
  );
};
