import React from 'react';
import { AnomalySignal } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/design-system';
import { Sparkles, Layers } from 'lucide-react';

export const AnomalySignalCard: React.FC<{ signal: AnomalySignal }> = ({ signal }) => {
  return (
    <Card className="border border-slate-200/90 shadow-card overflow-hidden">
      <CardHeader className="bg-slate-50/70 py-3.5 px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <CardTitle className="text-sm font-bold text-slate-900">{signal.title}</CardTitle>
          </div>
          <Badge variant="uncertain" size="sm">
            {signal.severity} ANOMALY PATTERN
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3.5">
        <p className="text-xs text-slate-700 leading-relaxed font-medium">{signal.reason}</p>

        {/* Comparison Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Parameter</th>
                <th className="py-2 px-3">Observed Value</th>
                <th className="py-2 px-3">Expected Physiological Pattern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {signal.contributingParameters.map((cp) => (
                <tr key={cp.parameterName} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-sans font-semibold text-slate-900">{cp.parameterName}</td>
                  <td className="py-2 px-3 font-bold text-red-600">{cp.observedValue}</td>
                  <td className="py-2 px-3 text-slate-600 font-sans">{cp.expectedPattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Physiological Correlation */}
        <div className="text-xs text-purple-900 bg-purple-50/70 p-2.5 rounded-lg border border-purple-200/60 leading-relaxed">
          <span className="font-bold block mb-0.5">Physiological Fingerprint:</span>
          {signal.physiologicalCorrelation}
        </div>
      </CardContent>
    </Card>
  );
};
