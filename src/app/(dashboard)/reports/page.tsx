'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { reportService } from '@/services';
import { Report } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Skeleton } from '@/design-system';
import { useAppStore } from '@/stores/useAppStore';
import { STATUS_COLORS } from '@/constants';
import { formatDate, formatBytes } from '@/lib/utils';
import { FileText, UploadCloud, ArrowRight, ShieldCheck, Clock, Layers, Sparkles } from 'lucide-react';

export default function ReportsPage() {
  const { setUploadModalOpen } = useAppStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const list = await reportService.getReports();
        setReports(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = reports.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Medical Laboratory Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified electronic lab reports, extracted clinical parameters, and quantitative signals
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setUploadModalOpen(true)}
          leftIcon={<UploadCloud className="w-4 h-4" />}
        >
          Upload Lab Report
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['ALL', 'COMPLETED', 'NEEDS_REVIEW', 'PROCESSING'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              statusFilter === s
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s === 'ALL' ? 'All Reports' : s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
          No reports found for this status.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((report) => {
            const statusMeta = STATUS_COLORS.report[report.status];
            return (
              <Card
                key={report.id}
                hoverable
                className="border border-slate-200 shadow-card flex flex-col justify-between p-5 space-y-3.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {report.fileType} • {formatBytes(report.fileSizeBytes)}
                    </span>
                    <Badge variant={report.status === 'COMPLETED' ? 'normal' : 'low'} size="sm">
                      {statusMeta.label}
                    </Badge>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2 leading-snug">{report.title}</h4>
                  <p className="text-xs font-semibold text-brand-700 mt-0.5">{report.patientName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{report.labName}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Parameters</span>
                      <span className="font-bold text-slate-900">{report.extractedParametersCount} Extracted</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Findings</span>
                      <span className="font-bold text-red-600">{report.flaggedFindingsCount} Flagged</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>Uploaded: {formatDate(report.uploadedAt)}</span>
                  </div>

                  <Link href={`/reports/${report.id}`} className="block pt-1">
                    <Button variant="outline" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      <span>Inspect Extracted Findings</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
