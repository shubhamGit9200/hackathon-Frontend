'use client';

import React, { useState } from 'react';
import { Modal, Button, Input, Select, Alert } from '@/design-system';
import { patientService, auditService } from '@/services';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { UserPlus } from 'lucide-react';

export interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated?: () => void;
}

export const CreatePatientModal: React.FC<CreatePatientModalProps> = ({
  isOpen,
  onClose,
  onPatientCreated,
}) => {
  const { user } = useAuthStore();
  const { addToast } = useAppStore();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [bloodGroup, setBloodGroup] = useState('B +ve');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('Family');
  const [clinicalHistorySummary, setClinicalHistorySummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide the full legal name of the patient.');
      return;
    }
    if (!age || isNaN(Number(age))) {
      setError('Please enter a valid age.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newPatient = await patientService.createPatient({
        fullName,
        age: Number(age),
        gender,
        bloodGroup,
        contactNumber: contactNumber || '+91 00000 00000',
        email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        city: city || 'Not Specified',
        emergencyContact: {
          name: emergencyContactName || 'Primary Contact',
          relationship: emergencyRelationship,
          phone: emergencyContactPhone || contactNumber || '+91 00000 00000',
        },
        clinicalHistorySummary:
          clinicalHistorySummary || 'Newly registered patient record.',
        lastVisitDate: new Date().toISOString(),
      });

      await auditService.logEvent({
        actorId: user.id,
        actorName: user.fullName,
        actorRole: user.role,
        action: 'PATIENT_CONTEXT_SUBMITTED',
        resourceType: 'PATIENT',
        resourceId: newPatient.id,
        resourceSummary: `Registered patient profile: ${newPatient.fullName} (${newPatient.mrn})`,
      });

      setIsSubmitting(false);
      addToast({
        type: 'success',
        title: 'Patient Profile Created',
        message: `${newPatient.fullName} registered with MRN: ${newPatient.mrn}.`,
      });

      setFullName('');
      setAge('');
      setContactNumber('');
      setEmail('');
      setCity('');
      setClinicalHistorySummary('');

      if (onPatientCreated) onPatientCreated();
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to create patient profile. Please check the form fields.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Patient Profile"
      description="Create a medical record number (MRN) and patient demographics"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Legal Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Ramesh Chandra Verma"
            required
          />
          <Input
            label="Age (Years)"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 48"
            min={1}
            max={120}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as any)}
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHER', label: 'Other / Non-Binary' },
            ]}
          />
          <Select
            label="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            options={[
              { value: 'A +ve', label: 'A +ve' },
              { value: 'A -ve', label: 'A -ve' },
              { value: 'B +ve', label: 'B +ve' },
              { value: 'B -ve', label: 'B -ve' },
              { value: 'O +ve', label: 'O +ve' },
              { value: 'O -ve', label: 'O -ve' },
              { value: 'AB +ve', label: 'AB +ve' },
              { value: 'AB -ve', label: 'AB -ve' },
            ]}
          />
          <Input
            label="City & State"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Mumbai, Maharashtra"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Contact Phone"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="+91 98200 00000"
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="patient@example.com"
          />
        </div>

        {/* Clinical Summary */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Clinical Summary / Known Conditions (Optional)
          </label>
          <textarea
            rows={3}
            value={clinicalHistorySummary}
            onChange={(e) => setClinicalHistorySummary(e.target.value)}
            placeholder="e.g. Known hypertensive, reports occasional exertional fatigue. Routine lab checkup requested..."
            className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Create Patient Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
};
