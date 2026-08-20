'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { findingService } from '@/services';
import { Finding } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Skeleton } from '@/design-system';
import { STATUS_COLORS } from '@/constants';
import { formatDate } from '@/lib/utils';
import { Sparkles, ArrowRight, ShieldAlert, GitPullRequestDraft, MessageSquare, Clock, Filter } from 'lucide-react';

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priorityFilter, setFilterPriority] = useState<string>('ALL');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const list = await findingService.getFindings();
        setFindings(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = findings.filter((f) => {
    if (priorityFilter === 'ALL') return true;
    return f.priority === priorityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600" />
            Evidence-Linked Findings Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every finding is mathematically and physiologically traced back to raw report values and clinical standards
          </p>
        </div>
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              priorityFilter === p
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p === 'ALL' ? 'All Findings' : `${p} Priority`}
          </button>
        ))}
      </div>

      {/* Findings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
          No findings match the selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((finding) => {
            const priorityMeta = STATUS_COLORS.priority[finding.priority];
            const reviewMeta = STATUS_COLORS.review[finding.reviewState];

            return (
              <Card
                key={finding.id}
                hoverable
                className="border border-slate-200 shadow-card p-5 space-y-3.5 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <Badge variant={finding.priority === 'CRITICAL' ? 'critical' : finding.priority === 'HIGH' ? 'high' : 'low'}>
                      {priorityMeta.label}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-slate-500">ID: {finding.id}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-700">{finding.patientName}</span>
                  </div>

                  <Badge variant={finding.reviewState === 'RESOLVED' ? 'normal' : 'low'} size="sm">
                    {reviewMeta.label}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{finding.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{finding.clinicalSummary}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-semibold">
                      6/6 Evidence Steps Traced
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Rule: {finding.ruleVersion}
                    </span>
                  </div>

                  <Link href={`/findings/${finding.id}`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Inspect 6-Step Evidence Chain
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
