'use client';

import React, { useState } from 'react';
import { Finding, ReviewDecisionAction } from '@/types';
import { Badge, Button, Card, CardHeader, CardTitle, CardContent } from '@/design-system';
import { STATUS_COLORS, CLINICAL_SAFETY_DISCLAIMERS } from '@/constants';
import { formatDate } from '@/lib/utils';
import {
  GitPullRequestDraft,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export interface ClinicianReviewQueueProps {
  findings: Finding[];
  onSelectFindingForReview: (finding: Finding) => void;
}

export const ClinicianReviewQueue: React.FC<ClinicianReviewQueueProps> = ({
  findings,
  onSelectFindingForReview,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const filtered = findings.filter((f) => {
    if (filterPriority === 'ALL') return true;
    return f.priority === filterPriority;
  });

  return (
    <div className="space-y-4">
      {/* Review Queue Preamble */}
      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 space-y-1 leading-relaxed">
          <span className="font-bold block">Clinician Verification & Review Boundary</span>
          <p className="text-emerald-800">{CLINICAL_SAFETY_DISCLAIMERS.clinicianReviewPreamble}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              filterPriority === p
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p === 'ALL' ? 'All Priorities' : `${p} Priority`}
          </button>
        ))}
      </div>

      {/* Review Queue Items */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
            No findings currently pending clinician review in this filter.
          </div>
        ) : (
          filtered.map((finding) => {
            const priorityMeta = STATUS_COLORS.priority[finding.priority];
            const reviewMeta = STATUS_COLORS.review[finding.reviewState];

            return (
              <Card
                key={finding.id}
                className="border border-slate-200 hover:border-slate-300 shadow-card transition-all p-5 space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <Badge variant={finding.priority === 'CRITICAL' ? 'critical' : finding.priority === 'HIGH' ? 'high' : 'low'}>
                      {priorityMeta.label}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-slate-500">ID: {finding.id}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-700">{finding.patientName}</span>
                  </div>

                  <Badge variant={finding.reviewState === 'RESOLVED' ? 'normal' : 'low'} size="sm">
                    {reviewMeta.label}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{finding.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {finding.clinicalSummary}
                  </p>
                </div>

                {/* Patient context badge & Evidence count */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    {finding.patientContextResponse ? (
                      <div className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200/60 font-medium">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Patient Context Attached ({finding.patientContextResponse.selectedSymptomIds.length} symptoms)</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No patient context submitted</span>
                    )}

                    <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatDate(finding.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/findings/${finding.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Inspect Evidence Chain
                      </Button>
                    </Link>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onSelectFindingForReview(finding)}
                      leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                    >
                      Record Clinical Decision
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
