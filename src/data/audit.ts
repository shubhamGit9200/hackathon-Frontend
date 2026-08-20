import { AuditEvent, SystemStats } from '@/types';

export const MOCK_AUDIT_EVENTS: AuditEvent[] = [];

export const MOCK_SYSTEM_STATS: SystemStats = {
  totalPatients: 1,
  totalReportsProcessed: 0,
  openFindingsCount: 0,
  criticalFindingsCount: 0,
  pendingClinicianReviewsCount: 0,
  averageVerificationConfidence: 0.985,
  systemHealthStatus: 'HEALTHY',
};
