import { UserRole, ReportFileType, FindingPriority, FindingReviewState, AbnormalityStatus, RiskCategory } from '@/types';

export const APP_CONFIG = {
  name: 'MedVerify AI',
  tagline: 'Explainable Medical-Report Verification & Decision Support',
  version: '1.0.0-phase1',
  supportEmail: 'clinical-support@medverify.ai',
  supportedFormats: ['PDF', 'PNG', 'JPG'] as ReportFileType[],
  maxFileSizeBytes: 25 * 1024 * 1024, // 25 MB
  maxFileSizeLabel: '25 MB',
  rulesetVersion: 'ICMR-WHO-v2026.2',
  analysisEngineVersion: 'MedVerify-Core-3.4.1',
};

export const CLINICAL_SAFETY_DISCLAIMERS = {
  generalBanner:
    'MedVerify AI provides explainable clinical decision support and verification metrics for medical reports. It is not an autonomous diagnosis, prescription, or medicine recommendation tool. All consequential medical decisions must be reviewed and made by qualified healthcare professionals.',
  patientExplanationNote:
    'This plain-language summary explains what this specific laboratory value may relate to in everyday terms. It is not a medical diagnosis. Your care team will review this finding alongside your complete clinical history.',
  patientContextPrompt:
    'Have you noticed any of the following bodily experiences recently? Sharing your context helps your clinician evaluate the laboratory findings with greater clarity.',
  clinicianReviewPreamble:
    'Verification signals and multi-parameter anomalies are computed against ICMR/WHO reference ranges and physiological consistency rules. Final clinical interpretation and diagnostic sign-off remain strictly with the reviewer.',
  uncertaintyIndicator:
    'Verification certainty is limited due to borderline value or missing historical baselines. Clinical correlation is advised.',
};

export const ROLE_CONFIG: Record<
  UserRole,
  {
    label: string;
    badgeColor: string;
    description: string;
    allowedRoutes: string[];
  }
> = {
  CLINICIAN: {
    label: 'Clinician / Reviewer',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Full access to verification evidence, clinical review queue, and sign-off tools.',
    allowedRoutes: ['/dashboard', '/patients', '/reports', '/findings', '/review', '/audit'],
  },
  PATIENT: {
    label: 'Patient',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Access to personal reports, plain-language explanations, and symptom context sharing.',
    allowedRoutes: ['/dashboard', '/patients', '/reports', '/findings'],
  },
  ADMIN: {
    label: 'System Administrator',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'System operational health, user management, and compliance audit trail inspection.',
    allowedRoutes: ['/dashboard', '/patients', '/reports', '/findings', '/review', '/audit', '/settings'],
  },
};

export const STATUS_COLORS = {
  abnormality: {
    NORMAL: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Normal',
    },
    LOW: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Low',
    },
    HIGH: {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-500',
      label: 'High',
    },
    CRITICAL_LOW: {
      bg: 'bg-red-50 text-red-700 border-red-200 font-semibold',
      dot: 'bg-red-600',
      label: 'Critical Low',
    },
    CRITICAL_HIGH: {
      bg: 'bg-red-50 text-red-700 border-red-200 font-semibold',
      dot: 'bg-red-600',
      label: 'Critical High',
    },
    INCONCLUSIVE: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      dot: 'bg-purple-500',
      label: 'Inconclusive',
    },
  },
  priority: {
    CRITICAL: {
      bg: 'bg-red-100 text-red-800 border-red-300',
      border: 'border-red-500',
      dot: 'bg-red-600',
      label: 'Critical Priority',
    },
    HIGH: {
      bg: 'bg-orange-100 text-orange-800 border-orange-300',
      border: 'border-orange-500',
      dot: 'bg-orange-600',
      label: 'High Priority',
    },
    MODERATE: {
      bg: 'bg-amber-100 text-amber-800 border-amber-300',
      border: 'border-amber-500',
      dot: 'bg-amber-500',
      label: 'Moderate Priority',
    },
    LOW: {
      bg: 'bg-blue-100 text-blue-800 border-blue-300',
      border: 'border-blue-500',
      dot: 'bg-blue-500',
      label: 'Low Priority',
    },
    INFORMATIONAL: {
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      border: 'border-slate-400',
      dot: 'bg-slate-500',
      label: 'Informational',
    },
  },
  review: {
    OPEN: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      label: 'Awaiting Clinician Review',
    },
    UNDER_REVIEW: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Under Review',
    },
    RESOLVED: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Clinician Resolved',
    },
    ESCALATED: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      label: 'Escalated to Specialist',
    },
  },
  report: {
    QUEUED: {
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      label: 'Queued',
    },
    PROCESSING: {
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      label: 'Processing Pipeline',
    },
    COMPLETED: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Verification Complete',
    },
    NEEDS_REVIEW: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Flagged for Review',
    },
    FAILED: {
      bg: 'bg-red-50 text-red-700 border-red-200',
      label: 'Extraction Failed',
    },
  },
};
