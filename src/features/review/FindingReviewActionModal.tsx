'use client';

import React, { useState } from 'react';
import { Finding, ReviewDecisionAction } from '@/types';
import { Modal, Button, Select, Badge, Alert } from '@/design-system';
import { reviewService } from '@/services';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { UserCheck, ShieldCheck, MessageSquare } from 'lucide-react';

export interface FindingReviewActionModalProps {
  finding: Finding | null;
  isOpen: boolean;
  onClose: () => void;
  onActionCompleted?: (updatedFinding: Finding) => void;
}

export const FindingReviewActionModal: React.FC<FindingReviewActionModalProps> = ({
  finding,
  isOpen,
  onClose,
  onActionCompleted,
}) => {
  const { user } = useAuthStore();
  const { addToast } = useAppStore();

  const [action, setAction] = useState<ReviewDecisionAction>('CLINICALLY_CORRELATED_RESOLVED');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!finding) return null;

  const actionOptions: { value: ReviewDecisionAction; label: string }[] = [
    {
      value: 'CLINICALLY_CORRELATED_RESOLVED',
      label: 'Clinically Correlated & Addressed (Resolve)',
    },
    {
      value: 'ESCALATE_TO_SPECIALIST',
      label: 'Escalate to Specialist Consultation',
    },
    {
      value: 'REQUEST_REPEAT_TEST',
      label: 'Request Confirmatory Repeat Test',
    },
    {
      value: 'ACKNOWLEDGE_AND_MONITOR',
      label: 'Acknowledge & Continue Observation',
    },
    {
      value: 'DISMISSED_AS_ARTIFACT',
      label: 'Dismiss as Known Laboratory Artifact',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalNotes.trim()) {
      setError('Please provide clinical notes documenting your rationale.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await reviewService.submitReviewAction(
        finding.id,
        action,
        clinicalNotes,
        {
          id: user.id,
          name: user.fullName,
          role: user.role,
          department: user.department || 'Internal Medicine',
        },
        followUp || undefined
      );

      setIsSubmitting(false);
      addToast({
        type: 'success',
        title: 'Clinical Decision Recorded',
        message: `Action "${action.replace(/_/g, ' ')}" signed off by ${user.fullName}.`,
      });

      if (updated && onActionCompleted) {
        onActionCompleted(updated);
      }
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to record review action. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clinician Decision & Sign-Off"
      description={`Record formal medical sign-off for finding: ${finding.title}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Finding Summary Banner */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">{finding.title}</span>
            <Badge variant={finding.priority === 'CRITICAL' ? 'critical' : 'high'} size="sm">
              {finding.priority}
            </Badge>
          </div>
          <p className="text-slate-600 line-clamp-2">{finding.clinicalSummary}</p>
        </div>

        {/* Patient Context Highlights if present */}
        {finding.patientContextResponse && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Patient-Reported Context:</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Reported experiences: {finding.patientContextResponse.selectedSymptomIds.join(', ')}
              {finding.patientContextResponse.patientNotes && ` • Note: "${finding.patientContextResponse.patientNotes}"`}
            </p>
          </div>
        )}

        {/* Review Action Dropdown */}
        <Select
          label="Clinical Action"
          value={action}
          onChange={(e) => setAction(e.target.value as ReviewDecisionAction)}
          options={actionOptions}
        />

        {/* Clinician Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Clinician Assessment Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Document your medical evaluation and clinical rationale..."
            className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>

        {/* Recommended Follow-up / Orders */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Recommended Follow-Up / Laboratory Orders (Optional)
          </label>
          <input
            type="text"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            placeholder="e.g. Order Serum Ferritin + Complete Iron Profile"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>

        {/* Signer Details */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-slate-600" />
            <span className="font-medium">Reviewing: {user.fullName}</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {user.department || 'Internal Medicine'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
          >
            Record Decision
          </Button>
        </div>
      </form>
    </Modal>
  );
};
