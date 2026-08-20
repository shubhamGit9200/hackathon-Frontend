import { Finding, ReviewDecisionAction, ReviewerDecision } from '@/types';
import { findingService } from './findingService';
import { auditService } from './auditService';

class ReviewService {
  async getReviewQueue(): Promise<Finding[]> {
    const findings = await findingService.getFindings();
    // Prioritize: CRITICAL -> HIGH -> MODERATE -> LOW
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MODERATE: 2, LOW: 3, INFORMATIONAL: 4 };
    return findings.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  async submitReviewAction(
    findingId: string,
    action: ReviewDecisionAction,
    clinicalNotes: string,
    reviewer: { id: string; name: string; role: string; department: string },
    followUpRecommendation?: string
  ): Promise<Finding | null> {
    const decision: ReviewerDecision = {
      reviewerId: reviewer.id,
      reviewerName: reviewer.name,
      reviewerRole: reviewer.role,
      department: reviewer.department,
      action,
      clinicalNotes,
      followUpRecommendation,
      reviewedAt: new Date().toISOString(),
    };

    const updated = await findingService.updateFindingReviewDecision(findingId, decision);

    if (updated) {
      await auditService.logEvent({
        actorId: reviewer.id,
        actorName: reviewer.name,
        actorRole: reviewer.role as any,
        action: 'CLINICIAN_DECISION_RECORDED',
        resourceType: 'FINDING',
        resourceId: findingId,
        resourceSummary: `Clinician decision recorded: ${action} with note: "${clinicalNotes.slice(0, 60)}..."`,
        metadata: { action, followUpRecommendation },
      });
    }

    return updated;
  }
}

export const reviewService = new ReviewService();
