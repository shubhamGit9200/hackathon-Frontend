import { Patient } from '@/types';
import { MOCK_PATIENTS } from '@/data';

class PatientService {
  private patients: Patient[] = [...MOCK_PATIENTS];

  async getPatients(searchQuery = ''): Promise<Patient[]> {
    return new Promise((resolve) => {
      let filtered = [...this.patients];
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.fullName.toLowerCase().includes(q) ||
            p.mrn.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q)
        );
      }
      setTimeout(() => resolve(filtered), 100);
    });
  }

  async getPatientById(id: string): Promise<Patient | null> {
    return new Promise((resolve) => {
      const patient = this.patients.find((p) => p.id === id) || null;
      setTimeout(() => resolve(patient ? { ...patient } : null), 80);
    });
  }

  async createPatient(
    data: Omit<Patient, 'id' | 'mrn' | 'activeReportsCount' | 'openFindingsCount' | 'createdAt' | 'updatedAt'>
  ): Promise<Patient> {
    return new Promise((resolve) => {
      const newPatient: Patient = {
        ...data,
        id: `pat-${Date.now().toString().slice(-4)}`,
        mrn: `MRN-2026-IND-${Math.floor(1000 + Math.random() * 9000)}`,
        activeReportsCount: 0,
        openFindingsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.patients.unshift(newPatient);
      setTimeout(() => resolve({ ...newPatient }), 200);
    });
  }
}

export const patientService = new PatientService();
