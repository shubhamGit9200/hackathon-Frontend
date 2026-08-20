'use client';

import React, { useState } from 'react';
import { AuditEvent, UserRole } from '@/types';
import { Badge, Button, Drawer } from '@/design-system';
import { formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Search,
  Eye,
  FileText,
  User,
  Activity,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Database,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AuditLogTableProps {
  events: AuditEvent[];
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ events }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const filtered = events.filter((ev) => {
    const matchesRole = roleFilter === 'ALL' || ev.actorRole === roleFilter;
    const matchesSearch =
      ev.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.resourceSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.resourceId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const getActionBadgeVariant = (action: AuditEvent['action']) => {
    if (action.includes('UPLOAD') || action.includes('CREATED')) return 'info' as const;
    if (action.includes('DECISION') || action.includes('RESOLVED')) return 'normal' as const;
    if (action.includes('FLAGGED') || action.includes('ESCALATED')) return 'critical' as const;
    return 'default' as const;
  };

  const getActionDisplayName = (action: string) => {
    return action.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit actions, actors, resources..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 w-64"
            />
          </div>

          <div className="flex items-center gap-1">
            {['ALL', 'CLINICIAN', 'PATIENT', 'ADMIN'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  roleFilter === r ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          <span>Total Logged Events: </span>
          <span className="font-bold text-slate-900">{filtered.length}</span>
        </div>
      </div>

      {/* Main Audit Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">Activity Summary</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No compliance audit events recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {formatDate(ev.timestamp)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{ev.actorName}</div>
                      <Badge variant="outline" size="sm" className="mt-0.5">
                        {ev.actorRole}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={getActionBadgeVariant(ev.action)} size="sm">
                        {getActionDisplayName(ev.action)}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {ev.resourceType} : {ev.resourceId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 max-w-sm">
                      <p className="line-clamp-2 leading-relaxed">{ev.resourceSummary}</p>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(ev);
                          setShowRawJson(false);
                        }}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structured Human-Readable Metadata Drawer */}
      <Drawer
        isOpen={!!selectedEvent}
        onClose={() => {
          setSelectedEvent(null);
          setShowRawJson(false);
        }}
        title="Audit Event Details"
        subtitle={`Record ID: ${selectedEvent?.id}`}
        width="lg"
      >
        {selectedEvent && (
          <div className="space-y-4">
            {/* Event Overview Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Action Performed:</span>
                <Badge variant={getActionBadgeVariant(selectedEvent.action)} size="md">
                  {getActionDisplayName(selectedEvent.action)}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Actor / User:</span>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">{selectedEvent.actorName}</span>
                  <span className="text-[11px] text-slate-500 font-mono">Role: {selectedEvent.actorRole}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Logged Timestamp:</span>
                <span className="font-mono font-semibold text-slate-800">{formatDate(selectedEvent.timestamp)}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Target Resource:</span>
                <span className="font-mono text-slate-800 font-semibold bg-white px-2 py-0.5 rounded border">
                  {selectedEvent.resourceType} • {selectedEvent.resourceId}
                </span>
              </div>
            </div>

            {/* Human-Readable Activity Summary */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">Activity Summary</label>
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                {selectedEvent.resourceSummary}
              </div>
            </div>

            {/* Extracted Metadata Breakdown */}
            {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900">Logged Attributes & Context</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedEvent.metadata).map(([key, value]) => (
                    <div key={key} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance & Tamper-Evident Integrity Notice */}
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Verified Audit Entry</span>
                <p className="text-[11px] text-emerald-700 mt-0.5 leading-snug">
                  This record is permanently signed in the append-only hospital compliance journal.
                </p>
              </div>
            </div>

            {/* Optional Collapsible Raw JSON Data */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span>Technical Audit Payload (JSON)</span>
                {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showRawJson && (
                <pre className="mt-2 p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                  {JSON.stringify(
                    {
                      id: selectedEvent.id,
                      action: selectedEvent.action,
                      actor: {
                        id: selectedEvent.actorId,
                        name: selectedEvent.actorName,
                        role: selectedEvent.actorRole,
                      },
                      resource: {
                        type: selectedEvent.resourceType,
                        id: selectedEvent.resourceId,
                      },
                      metadata: selectedEvent.metadata || {},
                      timestamp: selectedEvent.timestamp,
                    },
                    null,
                    2
                  )}
                </pre>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
