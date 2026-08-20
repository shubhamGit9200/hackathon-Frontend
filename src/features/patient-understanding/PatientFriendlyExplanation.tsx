import React from 'react';
import { Finding } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/design-system';
import { CLINICAL_SAFETY_DISCLAIMERS } from '@/constants';
import { HeartPulse, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PatientFriendlyExplanation: React.FC<{ finding: Finding }> = ({ finding }) => {
  return (
    <Card className="border border-slate-200 shadow-subtle bg-white overflow-hidden space-y-4 p-6">
      {/* Title */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <HeartPulse className="w-5 h-5 text-brand-600" />
        <div>
          <h3 className="text-sm font-bold text-slate-900">Understanding Your Result</h3>
          <p className="text-xs text-slate-500">Plain-language summary of this laboratory finding</p>
        </div>
      </div>

      {/* Main Plain-Language Explanation */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-900">What does this test result mean?</h4>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/70 font-medium">
          {finding.plainLanguageExplanation}
        </p>
      </div>

      {/* Potential Bodily Effects */}
      {finding.potentialBodyEffects.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-semibold text-slate-900">
            What this result may relate to in everyday experiences:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {finding.potentialBodyEffects.map((effect, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-700 flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                <span className="leading-snug">{effect}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-slate-900 block mb-0.5">Please Note:</span>
          {CLINICAL_SAFETY_DISCLAIMERS.patientExplanationNote}
        </div>
      </div>
    </Card>
  );
};
