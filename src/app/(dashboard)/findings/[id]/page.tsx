'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { findingService } from '@/services';
import { Finding } from '@/types';
import { EvidenceChain } from '@/features/evidence/EvidenceChain';
import { PatientFriendlyExplanation } from '@/features/patient-understanding/PatientFriendlyExplanation';
import { PatientContextForm } from '@/features/patient-understanding/PatientContextForm';
import { FindingReviewActionModal } from '@/features/review/FindingReviewActionModal';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Tabs, Skeleton } from '@/design-system';
import { STATUS_COLORS } from '@/constants';
import { formatDate } from '@/lib/utils';
import {
  Sparkles,
  ArrowLeft,
  ShieldAlert,
  UserCheck,
  HeartPulse,
  Clock,
  Layers,
  FileCheck2,
  Share2,
} from 'lucide-react';

export default function FindingDetailPage() {
  const params = useParams();
  const findingId = params?.id as string;

  const [finding, setFinding] = useState<Finding | null>(null);
  const [activeTab, setActiveTab] = useState<string>('EVIDENCE');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!findingId) return;
      setIsLoading(true);
      try {
        const f = await findingService.getFindingById(findingId);
        setFinding(f);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [findingId]);

  if (isLoading) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  if (!finding) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white border rounded-xl">
        Finding record not found.
      </div>
    );
  }

  const priorityMeta = STATUS_COLORS.priority[finding.priority];
  const reviewMeta = STATUS_COLORS.review[finding.reviewState];

  const tabs = [
    {
      id: 'EVIDENCE',
      label: 'Evidence Chain (6 Steps)',
      count: 6,
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'PATIENT_GUIDE',
      label: 'Patient-Friendly Explanation',
      icon: <HeartPulse className="w-4 h-4" />,
    },
    {
      id: 'PATIENT_CONTEXT',
      label: 'Patient Lived Context',
      count: finding.patientContextResponse ? 1 : 0,
      icon: <FileCheck2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/findings" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Findings Directory</span>
      </Link>

      {/* Header Banner */}
      <Card className="border border-slate-200 shadow-card bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={finding.priority === 'CRITICAL' ? 'critical' : 'high'}>
                {priorityMeta.label}
              </Badge>
              <Badge variant={finding.reviewState === 'RESOLVED' ? 'normal' : 'low'} size="sm">
                {reviewMeta.label}
              </Badge>
              <span className="font-mono text-xs text-slate-400">Rule: {finding.ruleVersion}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 leading-tight">{finding.title}</h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="text-brand-700 font-bold">Patient: {finding.patientName}</span>
              <span>•</span>
              <span className="font-mono">Report ID: {finding.reportId}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5" /> Flagged {formatDate(finding.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsReviewModalOpen(true)}
              leftIcon={<UserCheck className="w-4 h-4" />}
            >
              Record Clinician Decision
            </Button>
          </div>
        </div>

        {/* Clinical Summary */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Clinical Summary & Pathophysiology
          </span>
          <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border">
            {finding.clinicalSummary}
          </p>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id)} />

      {/* Tab Panels */}
      {activeTab === 'EVIDENCE' && <EvidenceChain finding={finding} />}

      {activeTab === 'PATIENT_GUIDE' && <PatientFriendlyExplanation finding={finding} />}

      {activeTab === 'PATIENT_CONTEXT' && (
        <PatientContextForm
          finding={finding}
          onContextSubmitted={(updated) => setFinding(updated)}
        />
      )}

      {/* Clinician Review Modal */}
      <FindingReviewActionModal
        finding={finding}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onActionCompleted={(updated) => setFinding(updated)}
      />
    </div>
  );
}
