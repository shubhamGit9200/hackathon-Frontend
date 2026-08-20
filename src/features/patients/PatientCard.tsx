import React from 'react';
import Link from 'next/link';
import { Patient } from '@/types';
import { Card, CardContent, Badge, Button } from '@/design-system';
import { formatDate } from '@/lib/utils';
import { User, FileText, FileCheck2, MapPin, Phone, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const PatientCard: React.FC<{ patient: Patient }> = ({ patient }) => {
  return (
    <Card hoverable className="border border-slate-200 shadow-card flex flex-col justify-between overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
              {patient.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">{patient.fullName}</h4>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                <span className="font-mono font-bold text-slate-700">{patient.mrn}</span>
                <span>•</span>
                <span>
                  {patient.age}y / {patient.gender}
                </span>
                <span>•</span>
                <span className="font-medium text-brand-700">{patient.bloodGroup}</span>
              </div>
            </div>
          </div>

          {patient.openFindingsCount > 0 && (
            <Badge variant="critical" size="sm">
              {patient.openFindingsCount} Flagged
            </Badge>
          )}
        </div>

        {/* Clinical History Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed font-medium">
          {patient.clinicalHistorySummary}
        </p>

        {/* Details and metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="flex items-center gap-1.5 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{patient.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{patient.contactNumber}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <FileText className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span>{patient.activeReportsCount} Reports</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Last visit {formatDate(patient.lastVisitDate)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
          <Link href={`/patients/${patient.id}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              <span>View Clinical Dossier</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
