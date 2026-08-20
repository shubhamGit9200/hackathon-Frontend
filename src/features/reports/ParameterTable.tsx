'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Parameter, ParameterCategory, AbnormalityStatus } from '@/types';
import { Badge, Button, Drawer } from '@/design-system';
import { NormalRangeBar } from './NormalRangeBar';
import { STATUS_COLORS } from '@/constants';
import { formatConfidence } from '@/lib/utils';
import { Search, Filter, ShieldCheck, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ParameterTableProps {
  parameters: Parameter[];
  reportTitle?: string;
  reportDate?: string;
}

export const ParameterTable: React.FC<ParameterTableProps> = ({
  parameters,
  reportTitle,
  reportDate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeParameter, setActiveParameter] = useState<Parameter | null>(null);

  const categories: { label: string; value: string; count: number }[] = [
    { label: 'All', value: 'ALL', count: parameters.length },
    { label: 'CBC / Blood', value: 'CBC', count: parameters.filter((p) => p.category === 'CBC').length },
    { label: 'Glucose', value: 'GLYCEMIC', count: parameters.filter((p) => p.category === 'GLYCEMIC').length },
    { label: 'Liver (LFT)', value: 'LFT', count: parameters.filter((p) => p.category === 'LFT').length },
    { label: 'Renal (KFT)', value: 'KFT', count: parameters.filter((p) => p.category === 'KFT').length },
    { label: 'Lipids', value: 'LIPID', count: parameters.filter((p) => p.category === 'LIPID').length },
  ];

  const filtered = parameters.filter((param) => {
    const matchesCategory = selectedCategory === 'ALL' || param.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'ALL'
        ? true
        : selectedStatus === 'ABNORMAL'
        ? param.abnormalityStatus !== 'NORMAL'
        : param.abnormalityStatus === selectedStatus;
    const matchesSearch =
      param.canonicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (param.standardCode && param.standardCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      param.sourceRegion.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusBadgeVariant = (status: AbnormalityStatus) => {
    switch (status) {
      case 'NORMAL':
        return 'normal' as const;
      case 'LOW':
        return 'low' as const;
      case 'HIGH':
        return 'high' as const;
      case 'CRITICAL_LOW':
      case 'CRITICAL_HIGH':
        return 'critical' as const;
      default:
        return 'uncertain' as const;
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-subtle">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                'relative px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors flex items-center gap-1.5 z-10',
                selectedCategory === cat.value ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {selectedCategory === cat.value && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-slate-900 rounded-md -z-10 shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span>{cat.label}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] transition-colors',
                  selectedCategory === cat.value ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                )}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 w-44"
            />
          </div>

          <button
            onClick={() => setSelectedStatus(selectedStatus === 'ABNORMAL' ? 'ALL' : 'ABNORMAL')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5',
              selectedStatus === 'ABNORMAL'
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            )}
          >
            <Filter className="w-3 h-3 text-amber-600" />
            <span>Abnormal Only</span>
          </button>
        </div>
      </div>

      {/* Parameter Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4">Observed Value</th>
                <th className="py-3 px-4">Normal Range Gauge</th>
                <th className="py-3 px-4">Reference Standard</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No parameters found matching your criteria.
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((param, index) => {
                    const statusMeta = STATUS_COLORS.abnormality[param.abnormalityStatus];
                    return (
                      <motion.tr
                        key={param.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.22, delay: Math.min(index * 0.02, 0.2) }}
                        className={cn(
                          'hover:bg-slate-50/80 transition-colors',
                          param.abnormalityStatus === 'CRITICAL_LOW' || param.abnormalityStatus === 'CRITICAL_HIGH'
                            ? 'bg-rose-50/20'
                            : param.abnormalityStatus !== 'NORMAL'
                            ? 'bg-amber-50/15'
                            : ''
                        )}
                      >
                        {/* Name & category */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{param.canonicalName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {param.category}
                            {param.standardCode && ` • LOINC ${param.standardCode}`}
                          </div>
                        </td>

                        {/* Value & Unit */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                          <span>{param.value}</span> <span className="text-xs font-normal text-slate-500">{param.unit}</span>
                        </td>

                        {/* Normal Range Gauge */}
                        <td className="py-3.5 px-4">
                          <NormalRangeBar
                            value={param.value}
                            min={param.referenceMin}
                            max={param.referenceMax}
                            status={param.abnormalityStatus}
                            unit={param.unit}
                          />
                        </td>

                        {/* Reference Text */}
                        <td className="py-3.5 px-4 text-[11px] text-slate-600">
                          <div>{param.referenceRangeText}</div>
                          <div className="text-slate-400 text-[10px] truncate max-w-[180px]" title={param.referenceSource}>
                            {param.referenceSource}
                          </div>
                        </td>

                        {/* Abnormality Badge */}
                        <td className="py-3.5 px-4">
                          <Badge variant={getStatusBadgeVariant(param.abnormalityStatus)} size="sm">
                            {statusMeta.label}
                          </Badge>
                        </td>

                        {/* Details & Trace Trigger */}
                        <td className="py-3.5 px-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveParameter(param)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Trace
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parameter Trace Drawer */}
      <Drawer
        isOpen={!!activeParameter}
        onClose={() => setActiveParameter(null)}
        title={activeParameter?.canonicalName}
        subtitle="Verification provenance and source extraction details"
        width="lg"
      >
        {activeParameter && (
          <div className="space-y-5">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Extraction Quality</span>
                <span className="font-mono text-slate-600">
                  Confidence score: {formatConfidence(activeParameter.extractionConfidence)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Document Region</span>
                  <span className="font-medium text-slate-800">{activeParameter.sourceRegion}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Reference Standard</span>
                  <span className="font-medium text-slate-800">
                    {activeParameter.standardCode ? `LOINC ${activeParameter.standardCode}` : 'ICMR Standard'}
                  </span>
                </div>
              </div>
            </div>

            {/* Extracted snippet */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-900 block">Extracted Text Line</span>
              <div className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed border border-slate-800">
                {activeParameter.sourceSnippet || `${activeParameter.canonicalName} : ${activeParameter.value} ${activeParameter.unit}`}
              </div>
            </div>

            {/* Reference Range */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-900 block">Reference Framework</span>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Standard Range:</span>
                  <span className="font-bold text-slate-900">{activeParameter.referenceRangeText}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Source:</span>
                  <span className="text-slate-700">{activeParameter.referenceSource}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status:</span>
                  <Badge variant={getStatusBadgeVariant(activeParameter.abnormalityStatus)} size="sm">
                    {STATUS_COLORS.abnormality[activeParameter.abnormalityStatus].label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
