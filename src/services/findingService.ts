import { Finding, PatientContextResponse } from '@/types';
import { MOCK_FINDINGS } from '@/data';

class FindingService {
  private findings: Finding[] = [...MOCK_FINDINGS];

  async getFindings(reportId?: string, patientId?: string): Promise<Finding[]> {
    return new Promise((resolve) => {
      let list = [...this.findings];
      if (reportId) {
        list = list.filter((f) => f.reportId === reportId);
      }
      if (patientId) {
        list = list.filter((f) => f.patientId === patientId);
      }
      setTimeout(() => resolve(list), 80);
    });
  }

  async getFindingById(id: string): Promise<Finding | null> {
    return new Promise((resolve) => {
      const finding = this.findings.find((f) => f.id === id) || null;
      setTimeout(() => resolve(finding ? { ...finding } : null), 60);
    });
  }

  addFindings(newFindings: Finding[]): void {
    for (const f of newFindings) {
      if (!this.findings.some((existing) => existing.id === f.id)) {
        this.findings.unshift(f);
      }
    }
  }

  async submitPatientContext(
    findingId: string,
    response: Omit<PatientContextResponse, 'submittedAt'>
  ): Promise<Finding | null> {
    return new Promise((resolve) => {
      const finding = this.findings.find((f) => f.id === findingId);
      if (!finding) {
        resolve(null);
        return;
      }

      finding.patientContextResponse = {
        ...response,
        submittedAt: new Date().toISOString(),
      };
      finding.updatedAt = new Date().toISOString();

      setTimeout(() => resolve({ ...finding }), 200);
    });
  }

  async updateFindingReviewDecision(
    findingId: string,
    decision: NonNullable<Finding['reviewerDecision']>
  ): Promise<Finding | null> {
    return new Promise((resolve) => {
      const finding = this.findings.find((f) => f.id === findingId);
      if (!finding) {
        resolve(null);
        return;
      }

      finding.reviewerDecision = { ...decision };
      if (decision.action === 'CLINICALLY_CORRELATED_RESOLVED' || decision.action === 'DISMISSED_AS_ARTIFACT') {
        finding.reviewState = 'RESOLVED';
      } else if (decision.action === 'ESCALATE_TO_SPECIALIST') {
        finding.reviewState = 'ESCALATED';
      } else {
        finding.reviewState = 'UNDER_REVIEW';
      }

      finding.updatedAt = new Date().toISOString();
      setTimeout(() => resolve({ ...finding }), 200);
    });
  }
}

export const findingService = new FindingService();
