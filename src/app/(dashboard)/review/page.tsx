'use client';

import React, { useState, useEffect } from 'react';
import { reviewService, findingService } from '@/services';
import { Finding } from '@/types';
import { ClinicianReviewQueue } from '@/features/review/ClinicianReviewQueue';
import { FindingReviewActionModal } from '@/features/review/FindingReviewActionModal';
import { Skeleton } from '@/design-system';
import { GitPullRequestDraft } from 'lucide-react';

export default function ReviewQueuePage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const queue = await reviewService.getReviewQueue();
      setFindings(queue);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleSelectFinding = (finding: Finding) => {
    setSelectedFinding(finding);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <GitPullRequestDraft className="w-5 h-5 text-emerald-600" />
          Clinician Review & Sign-Off Queue
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Review prioritized evidence findings, inspect patient-reported symptoms, and record audited clinical sign-off
        </p>
      </div>

      {/* Main Review Queue */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : (
        <ClinicianReviewQueue
          findings={findings}
          onSelectFindingForReview={handleSelectFinding}
        />
      )}

      {/* Sign-Off Modal */}
      <FindingReviewActionModal
        finding={selectedFinding}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFinding(null);
        }}
        onActionCompleted={() => loadQueue()}
      />
    </div>
  );
}
