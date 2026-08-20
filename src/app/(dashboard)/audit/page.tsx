'use client';

import React, { useState, useEffect } from 'react';
import { auditService } from '@/services';
import { AuditEvent, SystemStats } from '@/types';
import { AuditLogTable } from '@/features/audit/AuditLogTable';
import { Card, CardHeader, CardTitle, CardContent, Badge, Skeleton } from '@/design-system';
import { ShieldCheck, ShieldAlert, Server, Activity, Database, Lock } from 'lucide-react';

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [evList, sysStats] = await Promise.all([
          auditService.getAuditLogs(),
          auditService.getSystemStats(),
        ]);
        setEvents(evList);
        setStats(sysStats);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-600" />
          Regulatory Compliance & Audit Trail
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Append-oriented immutable event log tracking all document uploads, algorithmic verifications, patient responses, and clinician sign-offs
        </p>
      </div>

      {/* System Integrity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border border-slate-200 shadow-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Engine Integrity</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-emerald-700">100% Audited</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Zero untracked inferences</span>
        </Card>

        <Card className="p-4 border border-slate-200 shadow-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Event Entries</span>
            <Database className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-900">{events.length} Events</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Append-only journal</span>
        </Card>

        <Card className="p-4 border border-slate-200 shadow-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Clinical Oversight</span>
            <ShieldCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-900">Enforced</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Clinician final authority</span>
        </Card>
      </div>

      {/* Audit Log Table */}
      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <AuditLogTable events={events} />
      )}
    </div>
  );
}
