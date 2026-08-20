'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { patientService, reportService, findingService } from '@/services';
import { Patient, Report, Finding } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Skeleton } from '@/design-system';
import { STATUS_COLORS } from '@/constants';
import { formatDate } from '@/lib/utils';
import {
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  FileCheck2,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Clock,
  HeartPulse,
} from 'lucide-react';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!patientId) return;
      setIsLoading(true);
      try {
        const [p, repList, findList] = await Promise.all([
          patientService.getPatientById(patientId),
          reportService.getReports(patientId),
          findingService.getFindings(undefined, patientId),
        ]);
        setPatient(p);
        setReports(repList);
        setFindings(findList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [patientId]);

  if (isLoading) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  if (!patient) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white border rounded-xl">
        Patient record not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/patients" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Patient Directory</span>
      </Link>

      {/* Patient Profile Header Card */}
      <Card className="border border-slate-200 shadow-card bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-800 font-black text-lg">
              {patient.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900">{patient.fullName}</h2>
                <Badge variant="normal" size="sm">
                  {patient.bloodGroup}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-1 font-mono">
                <span className="font-bold text-slate-800">MRN: {patient.mrn}</span>
                <span>•</span>
                <span>
                  {patient.age} Years / {patient.gender}
                </span>
                <span>•</span>
                <span className="font-sans flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {patient.city}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border text-center">
              <span className="text-slate-400 block text-[10px]">Active Reports</span>
              <span className="font-bold text-slate-900 text-sm">{reports.length}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border text-center">
              <span className="text-slate-400 block text-[10px]">Open Findings</span>
              <span className="font-bold text-red-600 text-sm">{findings.length}</span>
            </div>
          </div>
        </div>

        {/* Clinical History & Contacts */}
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-2 space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Clinical History & Diagnostic Notes
            </span>
            <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border">
              {patient.clinicalHistorySummary}
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Emergency Contact & Access
            </span>
            <div className="bg-slate-50 p-3 rounded-lg border space-y-1 text-[11px] text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">{patient.emergencyContact.name}</span> (
                {patient.emergencyContact.relationship})
              </p>
              <p className="font-mono">{patient.emergencyContact.phone}</p>
              <p className="font-mono truncate">{patient.email}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Patient Lab Reports & Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            Patient Laboratory Reports ({reports.length})
          </h3>
          <div className="space-y-3">
            {reports.map((r) => (
              <Card key={r.id} hoverable className="p-4 border border-slate-200 shadow-card space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{r.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{r.labName}</p>
                  </div>
                  <Badge variant={r.status === 'COMPLETED' ? 'normal' : 'low'} size="sm">
                    {r.status}
                  </Badge>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400">
                    Uploaded {formatDate(r.uploadedAt)}
                  </span>
                  <Link href={`/reports/${r.id}`}>
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                      Inspect Report
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Flagged Findings */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            Flagged Evidence Findings ({findings.length})
          </h3>
          <div className="space-y-3">
            {findings.map((f) => (
              <Card key={f.id} hoverable className="p-4 border border-slate-200 shadow-card space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant={f.priority === 'CRITICAL' ? 'critical' : 'high'} size="sm">
                      {f.priority} PRIORITY
                    </Badge>
                    <h5 className="text-xs font-bold text-slate-900 mt-1">{f.title}</h5>
                  </div>
                  <Link href={`/findings/${f.id}`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                      Evidence
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{f.clinicalSummary}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
