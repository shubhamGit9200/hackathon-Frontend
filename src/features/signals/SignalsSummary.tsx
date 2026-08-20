import React from 'react';
import { RiskSignal, AnomalySignal, ConsistencyCheck } from '@/types';
import { RiskSignalCard } from './RiskSignalCard';
import { AnomalySignalCard } from './AnomalySignalCard';
import { ConsistencyCheckCard } from './ConsistencyCheckCard';
import { ShieldAlert, Layers, CheckCheck } from 'lucide-react';

export interface SignalsSummaryProps {
  riskSignals: RiskSignal[];
  anomalySignals: AnomalySignal[];
  consistencyChecks: ConsistencyCheck[];
}

export const SignalsSummary: React.FC<SignalsSummaryProps> = ({
  riskSignals,
  anomalySignals,
  consistencyChecks,
}) => {
  return (
    <div className="space-y-6">
      {/* Risk Signals */}
      {riskSignals.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Observed Clinical Patterns ({riskSignals.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {riskSignals.map((signal) => (
              <RiskSignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>
      )}

      {/* Multi-Parameter Anomaly Patterns */}
      {anomalySignals.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Multi-Parameter Anomalies ({anomalySignals.length})
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {anomalySignals.map((signal) => (
              <AnomalySignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>
      )}

      {/* Cross-Parameter Consistency Checks */}
      {consistencyChecks.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Cross-Parameter Consistency Verification ({consistencyChecks.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {consistencyChecks.map((check) => (
              <ConsistencyCheckCard key={check.id} check={check} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
