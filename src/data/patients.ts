import { Patient } from '@/types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-self-001',
    mrn: 'MRN-2026-IND-0001',
    fullName: 'My Medical Profile',
    age: 42,
    gender: 'MALE',
    bloodGroup: 'B +ve',
    contactNumber: '+91 98000 00000',
    email: 'myhealth@medverify.ai',
    city: 'Mumbai, Maharashtra',
    emergencyContact: {
      name: 'Family Contact',
      relationship: 'Spouse',
      phone: '+91 98000 00001',
    },
    clinicalHistorySummary: 'Primary medical profile for report analysis and tracking.',
    activeReportsCount: 0,
    openFindingsCount: 0,
    lastVisitDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
