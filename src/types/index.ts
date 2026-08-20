export type UserRole = 'PATIENT' | 'CLINICIAN' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
  title?: string;
  avatarUrl?: string;
  assignedPatientId?: string; // For patient role
}

export interface Patient {
  id: string;
  mrn: string;
  fullName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup: string;
  contactNumber: string;
  email: string;
  city: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  clinicalHistorySummary: string;
  activeReportsCount: number;
  openFindingsCount: number;
  lastVisitDate: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportFileType = 'PDF' | 'PNG' | 'JPG';

export type ReportStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'NEEDS_REVIEW' | 'FAILED';

export interface Report {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  fileType: ReportFileType;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: string;
  labName: string;
  sampleCollectionDate: string;
  reportDate: string;
  status: ReportStatus;
  processingProgress: number; // 0 - 100
  processingStages?: {
    stage: 'OCR_EXTRACTION' | 'PARAMETER_NORMALIZATION' | 'REFERENCE_VERIFICATION' | 'SIGNAL_ANALYSIS' | 'EVIDENCE_SYNTHESIS';
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    durationMs?: number;
  }[];
  extractedParametersCount: number;
  flaggedFindingsCount: number;
  criticalSignalsCount: number;
}

export type ParameterCategory =
  | 'CBC'
  | 'LFT'
  | 'KFT'
  | 'LIPID'
  | 'GLYCEMIC'
  | 'CARDIAC'
  | 'THYROID'
  | 'ELECTROLYTES'
  | 'URINE'
  | 'GENERAL';

export type AbnormalityStatus =
  | 'NORMAL'
  | 'LOW'
  | 'HIGH'
  | 'CRITICAL_LOW'
  | 'CRITICAL_HIGH'
  | 'INCONCLUSIVE';

export interface Parameter {
  id: string;
  reportId: string;
  canonicalName: string;
  standardCode?: string; // LOINC code e.g. 718-7
  category: ParameterCategory;
  value: number | string;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  referenceRangeText: string;
  referenceSource: string;
  abnormalityStatus: AbnormalityStatus;
  extractionConfidence: number; // 0.00 to 1.00
  sourceRegion: string; // e.g. "Page 1, Hematology Section, Row 3"
  sourceSnippet?: string;
  measuredAt: string;
}

export interface VerificationCheck {
  id: string;
  parameterId: string;
  parameterName: string;
  ruleId: string;
  ruleVersion: string;
  result: 'PASS' | 'FLAGGED' | 'UNCERTAIN';
  ruleDescription: string;
  observedValue: string;
  expectedRange: string;
  deviationPercent?: number;
  clinicalContext: string;
}

export type RiskCategory = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface RiskSignal {
  id: string;
  reportId: string;
  category: RiskCategory;
  score: number; // 0 - 100
  label: string;
  confidenceRange: string;
  uncertaintyNote?: string;
  modelVersion: string;
  contributingParameterNames: string[];
  clinicalSignificance: string;
}

export interface AnomalySignal {
  id: string;
  reportId: string;
  title: string;
  reason: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  contributingParameters: {
    parameterName: string;
    observedValue: string;
    expectedPattern: string;
  }[];
  physiologicalCorrelation: string;
}

export interface ConsistencyCheck {
  id: string;
  reportId: string;
  title: string;
  result: 'CONSISTENT' | 'CONTRADICTORY' | 'PHYSIOLOGICALLY_PLAUSIBLE' | 'REQUIRES_RETEST';
  comparisonDescription: string;
  contributingParameters: {
    parameterName: string;
    value: string;
  }[];
  explanation: string;
  recommendationNote: string;
}

export type FindingType =
  | 'VERIFICATION'
  | 'RISK_SIGNAL'
  | 'ANOMALY_PATTERN'
  | 'CONSISTENCY_CHECK';

export type FindingPriority =
  | 'CRITICAL'
  | 'HIGH'
  | 'MODERATE'
  | 'LOW'
  | 'INFORMATIONAL';

export type FindingReviewState =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'RESOLVED'
  | 'ESCALATED';

export type EvidenceStepType =
  | 'REPORT_VALUE'
  | 'REFERENCE_RULE'
  | 'VERIFICATION_CHECK'
  | 'CONTRIBUTING_CONTEXT'
  | 'FINDING_SYNTHESIS'
  | 'REVIEW_ACTION';

export interface EvidenceStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  type: EvidenceStepType;
  primaryMetric?: {
    label: string;
    value: string;
    badge?: string;
    badgeVariant?: 'normal' | 'low' | 'high' | 'critical' | 'uncertain';
  };
  details: {
    label: string;
    value: string;
    isCode?: boolean;
  }[];
  sourceTrace?: {
    documentName: string;
    page: number;
    section: string;
    confidence: number;
  };
  ruleTrace?: {
    ruleId: string;
    ruleVersion: string;
    standard: string;
  };
  uncertaintyFlag?: boolean;
  uncertaintyReason?: string;
}

export interface AssociatedSymptom {
  id: string;
  label: string;
  description: string;
  commonality: 'COMMON' | 'OCCASIONAL' | 'RARE';
}

export interface PatientContextResponse {
  submittedAt: string;
  submittedBy: string;
  selectedSymptomIds: string[];
  patientNotes?: string;
  durationOfSymptoms?: string;
  activityImpact?: 'NONE' | 'MILD' | 'MODERATE' | 'SIGNIFICANT';
}

export type ReviewDecisionAction =
  | 'ACKNOWLEDGE_AND_MONITOR'
  | 'ESCALATE_TO_SPECIALIST'
  | 'REQUEST_REPEAT_TEST'
  | 'CLINICALLY_CORRELATED_RESOLVED'
  | 'DISMISSED_AS_ARTIFACT';

export interface ReviewerDecision {
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  department: string;
  action: ReviewDecisionAction;
  clinicalNotes: string;
  followUpRecommendation?: string;
  reviewedAt: string;
}

export interface Finding {
  id: string;
  reportId: string;
  patientId: string;
  patientName: string;
  type: FindingType;
  priority: FindingPriority;
  title: string;
  clinicalSummary: string;
  plainLanguageExplanation: string;
  potentialBodyEffects: string[];
  associatedSymptoms: AssociatedSymptom[];
  evidenceChain: EvidenceStep[];
  reviewState: FindingReviewState;
  reviewerDecision?: ReviewerDecision;
  patientContextResponse?: PatientContextResponse;
  ruleVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action:
    | 'REPORT_UPLOADED'
    | 'REPORT_PROCESSING_STARTED'
    | 'REPORT_PROCESSING_COMPLETED'
    | 'EXTRACTION_VERIFIED'
    | 'FINDING_FLAGGED'
    | 'PATIENT_CONTEXT_SUBMITTED'
    | 'CLINICIAN_REVIEW_STARTED'
    | 'CLINICIAN_DECISION_RECORDED'
    | 'FINDING_RESOLVED'
    | 'FINDING_ESCALATED'
    | 'AUDIT_LOG_ACCESSED';
  resourceType: 'REPORT' | 'FINDING' | 'PATIENT' | 'USER' | 'SYSTEM';
  resourceId: string;
  resourceSummary: string;
  metadata?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export interface SystemStats {
  totalPatients: number;
  totalReportsProcessed: number;
  openFindingsCount: number;
  criticalFindingsCount: number;
  pendingClinicianReviewsCount: number;
  averageVerificationConfidence: number;
  systemHealthStatus: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
}
