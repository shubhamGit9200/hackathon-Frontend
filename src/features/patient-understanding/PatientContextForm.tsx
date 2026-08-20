'use client';

import React, { useState } from 'react';
import { Finding, PatientContextResponse } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/design-system';
import { findingService, auditService } from '@/services';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { CLINICAL_SAFETY_DISCLAIMERS } from '@/constants';
import { MessageSquarePlus, Check, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PatientContextFormProps {
  finding: Finding;
  onContextSubmitted?: (updatedFinding: Finding) => void;
}

export const PatientContextForm: React.FC<PatientContextFormProps> = ({
  finding,
  onContextSubmitted,
}) => {
  const { user } = useAuthStore();
  const { addToast } = useAppStore();

  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>(
    finding.patientContextResponse?.selectedSymptomIds || []
  );
  const [patientNotes, setPatientNotes] = useState<string>(
    finding.patientContextResponse?.patientNotes || ''
  );
  const [duration, setDuration] = useState<string>(
    finding.patientContextResponse?.durationOfSymptoms || 'PAST_2_TO_4_WEEKS'
  );
  const [impact, setImpact] = useState<NonNullable<PatientContextResponse['activityImpact']>>(
    finding.patientContextResponse?.activityImpact || 'MILD'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(!!finding.patientContextResponse);

  const toggleSymptom = (id: string) => {
    if (isSubmitted) return;
    setSelectedSymptomIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updated = await findingService.submitPatientContext(finding.id, {
        submittedBy: user.fullName,
        selectedSymptomIds,
        patientNotes,
        durationOfSymptoms: duration,
        activityImpact: impact,
      });

      await auditService.logEvent({
        actorId: user.id,
        actorName: user.fullName,
        actorRole: user.role,
        action: 'PATIENT_CONTEXT_SUBMITTED',
        resourceType: 'FINDING',
        resourceId: finding.id,
        resourceSummary: `Patient ${user.fullName} submitted context with ${selectedSymptomIds.length} reported experiences.`,
        metadata: { selectedSymptomIds, impact },
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: 'Context Shared with Clinician',
        message: 'Your responses have been attached to this finding for your doctor to review.',
      });

      if (updated && onContextSubmitted) {
        onContextSubmitted(updated);
      }
    } catch (err) {
      setIsSubmitting(false);
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Unable to submit context at this time.',
      });
    }
  };

  return (
    <Card className="border border-slate-200 shadow-subtle bg-white p-6 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <MessageSquarePlus className="w-5 h-5 text-brand-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Share Your Lived Context</h3>
            <p className="text-xs text-slate-500">
              Optional feedback that assists your care team in evaluating this laboratory finding
            </p>
          </div>
        </div>

        {isSubmitted && (
          <Badge variant="normal" size="sm">
            Shared with Doctor
          </Badge>
        )}
      </div>

      {isSubmitted ? (
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Context Shared with Your Care Team</span>
          </div>
          <p className="text-slate-600">
            Your reported experiences have been recorded and attached to this finding in your clinician&apos;s review queue.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {CLINICAL_SAFETY_DISCLAIMERS.patientContextPrompt}
          </p>

          {/* Checklist of symptoms */}
          <div className="space-y-2">
            {finding.associatedSymptoms.map((sym) => {
              const isSelected = selectedSymptomIds.includes(sym.id);
              return (
                <div
                  key={sym.id}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleSymptom(sym.id);
                    }
                  }}
                  onClick={() => toggleSymptom(sym.id)}
                  className={cn(
                    'p-3 rounded-lg border text-xs cursor-pointer select-none transition-colors flex items-start gap-3',
                    isSelected
                      ? 'bg-slate-50 border-brand-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0',
                      isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="flex-1">
                    <span className="font-semibold leading-snug block">{sym.label}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{sym.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Duration & Impact Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                How long have you noticed these experiences?
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              >
                <option value="LESS_THAN_1_WEEK">Less than 1 week</option>
                <option value="PAST_1_TO_2_WEEKS">1 to 2 weeks</option>
                <option value="PAST_2_TO_4_WEEKS">2 to 4 weeks</option>
                <option value="OVER_1_MONTH">More than 1 month</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Impact on your daily routine or activities
              </label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              >
                <option value="NONE">None — Normal routine</option>
                <option value="MILD">Mild — Noticeable but manageable</option>
                <option value="MODERATE">Moderate — Limits certain activities</option>
                <option value="SIGNIFICANT">Significant — Needs rest</option>
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Any other notes for your care team (Optional)
            </label>
            <textarea
              rows={3}
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="e.g. Feeling drained particularly in the late afternoon; recently started walking in the evenings..."
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Share Context with Doctor
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};
