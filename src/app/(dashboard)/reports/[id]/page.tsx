'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { reportService, findingService } from '@/services';
import { Report, Parameter, RiskSignal, AnomalySignal, ConsistencyCheck, Finding } from '@/types';
import { ParameterTable } from '@/features/reports/ParameterTable';
import { SignalsSummary } from '@/features/signals/SignalsSummary';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Tabs, Skeleton } from '@/design-system';
import { STATUS_COLORS } from '@/constants';
import { formatDate, formatBytes } from '@/lib/utils';
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Table,
  Sliders,
} from 'lucide-react';

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params?.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [signals, setSignals] = useState<{
    riskSignals: RiskSignal[];
    anomalySignals: AnomalySignal[];
    consistencyChecks: ConsistencyCheck[];
  }>({ riskSignals: [], anomalySignals: [], consistencyChecks: [] });
  const [findings, setFindings] = useState<Finding[]>([]);
  const [activeTab, setActiveTab] = useState<string>('PARAMETERS');
  const [viewMode, setViewMode] = useState<'CLINICIAN' | 'PATIENT'>('CLINICIAN');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!reportId) return;
      setIsLoading(true);
      try {
        const [rep, paramsList, sigs, finds] = await Promise.all([
          reportService.getReportById(reportId),
          reportService.getParametersByReportId(reportId),
          reportService.getSignalsByReportId(reportId),
          findingService.getFindings(reportId),
        ]);
        setReport(rep);
        setParameters(paramsList);
        setSignals(sigs);
        setFindings(finds);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [reportId]);

  if (isLoading) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  if (!report) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white border rounded-xl">
        Report record not found.
      </div>
    );
  }

  const tabs = [
    {
      id: 'PARAMETERS',
      label: 'Extracted Parameters',
      count: parameters.length,
      icon: <Table className="w-4 h-4" />,
    },
    {
      id: 'SIGNALS',
      label: 'Risk & Anomaly Signals',
      count: signals.riskSignals.length + signals.anomalySignals.length + signals.consistencyChecks.length,
      icon: <Sliders className="w-4 h-4" />,
    },
    {
      id: 'FINDINGS',
      label: 'Evidence Findings',
      count: findings.length,
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between gap-3 print:hidden">
        <Link href="/reports" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports List</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {/* Clinician vs Patient View Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('CLINICIAN')}
              className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'CLINICIAN'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Clinician View</span>
            </button>
            <button
              onClick={() => setViewMode('PATIENT')}
              className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'PATIENT'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Patient View</span>
            </button>
          </div>

          {/* 1-Click Print & Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
          >
            Print Dossier
          </Button>
        </div>
      </div>

      {/* Report Header Card */}
      <Card className="border border-slate-200 shadow-card bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                {report.fileType} • {formatBytes(report.fileSizeBytes)}
              </span>
              <Badge variant={report.status === 'COMPLETED' ? 'normal' : 'low'} size="sm">
                {report.status}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">{report.title}</h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-brand-700 font-bold">Patient: {report.patientName}</span>
              <span>•</span>
              <span>{report.labName}</span>
              <span>•</span>
              <span className="font-mono text-slate-400">Sample Date: {formatDate(report.sampleCollectionDate)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 print:hidden">
            <Link href={`/patients/${report.patientId}`}>
              <Button variant="outline" size="sm">
                View Patient Dossier
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Patient Friendly Synthesis Guide (Visible in Patient View Mode) */}
      {viewMode === 'PATIENT' && (
        <Card className="border border-brand-200 bg-brand-50/40 p-5 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-brand-900">Your Health Summary (Plain Language)</h3>
              <p className="text-xs text-brand-800 leading-relaxed">
                {findings.length === 1 && findings[0].priority === 'LOW'
                  ? 'Great news! All verified test values in this report are in the healthy standard range. Your body’s essential balance indices look optimal.'
                  : `MedVerify has analyzed ${parameters.length} test markers in your report. ${findings.filter(f => f.priority !== 'LOW').length} item(s) are outside standard reference intervals and have been flagged below with clear explanations for your consultation with a doctor.`}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id)} className="print:hidden" />

      {/* Tab Content Panels */}
      {activeTab === 'PARAMETERS' && (
        <ParameterTable
          parameters={parameters}
          reportTitle={report.title}
          reportDate={report.reportDate}
        />
      )}

      {activeTab === 'SIGNALS' && (
        <SignalsSummary
          riskSignals={signals.riskSignals}
          anomalySignals={signals.anomalySignals}
          consistencyChecks={signals.consistencyChecks}
        />
      )}

      {activeTab === 'FINDINGS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              Evidence-Linked Structured Findings ({findings.length})
            </h3>
          </div>

          <div className="space-y-3">
            {findings.map((finding) => (
              <Card key={finding.id} hoverable className="border border-slate-200 p-5 shadow-card space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          finding.priority === 'CRITICAL'
                            ? 'critical'
                            : finding.priority === 'HIGH'
                            ? 'high'
                            : finding.priority === 'MODERATE'
                            ? 'low'
                            : 'normal'
                        }
                        size="sm"
                      >
                        {finding.priority === 'LOW' ? 'VERIFIED NORMAL' : `${finding.priority} PRIORITY`}
                      </Badge>
                      <span className="text-xs font-mono font-bold text-slate-500">ID: {finding.id}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{finding.title}</h4>
                  </div>

                  <Link href={`/findings/${finding.id}`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Inspect 6-Step Evidence Chain
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{finding.clinicalSummary}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Rule: {finding.ruleVersion}</span>
                  <span>Review state: {finding.reviewState}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
