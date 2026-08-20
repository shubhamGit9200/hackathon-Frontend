'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { patientService, reportService, findingService } from '@/services';
import { Patient, Report, Finding } from '@/types';
import { Card, Badge, Button, Skeleton } from '@/design-system';
import { formatDate } from '@/lib/utils';
import {
  Users,
  FileText,
  GitPullRequestDraft,
  UploadCloud,
  ArrowRight,
  Clipboard,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, activeRole } = useAuthStore();
  const { setUploadModalOpen } = useAppStore();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [patList, repList, findList] = await Promise.all([
          patientService.getPatients(),
          reportService.getReports(),
          findingService.getFindings(),
        ]);
        setPatients(patList);
        setReports(repList);
        setFindings(findList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      {/* Calm Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as <span className="font-semibold text-slate-800">{user.fullName}</span> •{' '}
            {activeRole === 'CLINICIAN'
              ? 'Review laboratory findings and verified patient evidence'
              : activeRole === 'PATIENT'
              ? 'View your laboratory reports and plain-language guidance'
              : 'Hospital compliance and audit trail'}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setUploadModalOpen(true)}
          leftIcon={<Clipboard className="w-4 h-4" />}
        >
          Paste or Upload Medical Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200 bg-white p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patients</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{patients.length}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Active profile</span>
          </div>
        </Card>

        <Card className="border border-slate-200 bg-white p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reports Analyzed</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{reports.length}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Processed & verified</span>
          </div>
        </Card>

        <Card className="border border-slate-200 bg-white p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Review</span>
            <GitPullRequestDraft className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{findings.length}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Actionable findings</span>
          </div>
        </Card>
      </div>

      {/* Clean State: When 0 reports exist */}
      {reports.length === 0 ? (
        <Card className="border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-brand-600">
            <Clipboard className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">No Medical Reports Analyzed Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste your medical laboratory test results (e.g. CBC, Blood Sugar, Kidney/Liver panel, Lipids, Thyroid) or upload a PDF report to see how MedVerify extracts, verifies, and explains your data.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setUploadModalOpen(true)}
              leftIcon={<Clipboard className="w-4 h-4" />}
            >
              Paste Your Medical Report
            </Button>
          </div>

          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs max-w-2xl mx-auto">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="font-semibold text-slate-900 block mb-0.5">1. Paste Raw Text</span>
              <p className="text-slate-500 text-[11px]">Copy-paste your lab values from an email, SMS, or medical portal.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="font-semibold text-slate-900 block mb-0.5">2. Clinical Range Check</span>
              <p className="text-slate-500 text-[11px]">Parameters are verified against standard ICMR & WHO reference benchmarks.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="font-semibold text-slate-900 block mb-0.5">3. 6-Step Evidence Chain</span>
              <p className="text-slate-500 text-[11px]">Inspect traceable evidence and plain-language patient explanations.</p>
            </div>
          </div>
        </Card>
      ) : (
        /* Active Dashboard with Reports and Findings */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Priority Findings */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Important Laboratory Findings</h2>
              <Link href="/findings" className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <span>View all ({findings.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {findings.map((finding) => (
                <Card
                  key={finding.id}
                  className="border border-slate-200 bg-white p-4 shadow-subtle hover:border-slate-300 transition-colors space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={finding.priority === 'CRITICAL' ? 'critical' : finding.priority === 'HIGH' ? 'high' : 'low'}
                          size="sm"
                        >
                          {finding.priority}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-700">{finding.patientName}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">{finding.title}</h3>
                    </div>

                    <Link href={`/findings/${finding.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        View Evidence
                      </Button>
                    </Link>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {finding.clinicalSummary}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Reference: {finding.ruleVersion}</span>
                    <span>Status: {finding.reviewState.replace(/_/g, ' ')}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right 1 Col: Recent Laboratory Reports */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Analyzed Reports</h2>
              <Link href="/reports" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                All reports
              </Link>
            </div>

            <div className="space-y-2.5">
              {reports.map((report) => (
                <Card key={report.id} className="border border-slate-200 bg-white p-3.5 shadow-subtle space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{report.title}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{report.patientName}</p>
                    </div>
                    <Badge variant={report.status === 'COMPLETED' ? 'normal' : 'low'} size="sm">
                      {report.status}
                    </Badge>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{report.extractedParametersCount} parameters extracted</span>
                    <span>{formatDate(report.uploadedAt)}</span>
                  </div>

                  <Link href={`/reports/${report.id}`} className="block pt-1">
                    <Button variant="ghost" size="sm" className="w-full justify-between text-brand-700">
                      <span>Inspect Parameters</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
