import { User } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr-clinician-1',
    email: 'dr.sharma@medverify.ai',
    fullName: 'Dr. Vivek Sharma, MD',
    role: 'CLINICIAN',
    department: 'Internal Medicine & Clinical Diagnostics',
    title: 'Senior Consultant Physician',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-patient-1',
    email: 'aarav.sharma@patient.medverify.ai',
    fullName: 'Aarav Sharma',
    role: 'PATIENT',
    assignedPatientId: 'pat-1',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-admin-1',
    email: 'admin@medverify.ai',
    fullName: 'Pooja Nair',
    role: 'ADMIN',
    department: 'Hospital IT & Compliance Operations',
    title: 'Lead Health Systems Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
];
