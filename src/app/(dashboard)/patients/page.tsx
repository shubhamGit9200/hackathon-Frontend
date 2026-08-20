'use client';

import React, { useState, useEffect } from 'react';
import { patientService } from '@/services';
import { Patient } from '@/types';
import { PatientCard } from '@/features/patients/PatientCard';
import { CreatePatientModal } from '@/features/patients/CreatePatientModal';
import { Button, Input, Skeleton } from '@/design-system';
import { useAppStore } from '@/stores/useAppStore';
import { Users, UserPlus, Search } from 'lucide-react';

export default function PatientsPage() {
  const { searchQuery, setSearchQuery } = useAppStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const list = await patientService.getPatients(searchQuery);
      setPatients(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" />
            Patient Clinical Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Standardized patient profiles with unique Medical Record Numbers (MRN) and historical lab dossiers
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Register New Patient
        </Button>
      </div>

      {/* Patient Search & List */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, MRN, or city..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Patient Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : patients.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
          No patients found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}

      {/* Create Patient Modal */}
      <CreatePatientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPatientCreated={() => loadPatients()}
      />
    </div>
  );
}
