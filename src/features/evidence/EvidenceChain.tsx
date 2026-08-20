'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Finding } from '@/types';
import { Badge, Button } from '@/design-system';
import {
  FileText,
  BookOpen,
  CheckCircle2,
  GitMerge,
  FileCheck2,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Info,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EvidenceChainProps {
  finding: Finding;
  compact?: boolean;
}

export const EvidenceChain: React.FC<EvidenceChainProps> = ({ finding, compact = false }) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
  });

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
  };

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return <FileText className="w-4 h-4 text-slate-700" />;
      case 2:
        return <BookOpen className="w-4 h-4 text-slate-700" />;
      case 3:
        return <CheckCircle2 className="w-4 h-4 text-slate-700" />;
      case 4:
        return <GitMerge className="w-4 h-4 text-slate-700" />;
      case 5:
        return <FileCheck2 className="w-4 h-4 text-slate-700" />;
      case 6:
        return <UserCheck className="w-4 h-4 text-slate-700" />;
      default:
        return <FileText className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Evidence Section Header */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">How This Finding Was Verified</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step verification from raw laboratory values to clinical recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            leftIcon={<Code className="w-3.5 h-3.5" />}
          >
            {showTechnicalDetails ? 'Hide Rule Codes' : 'View Rule Codes'}
          </Button>
        </div>
      </div>

      {/* Clean Step-by-Step Vertical Timeline */}
      <div className="relative pl-6 md:pl-8 space-y-4 before:absolute before:left-3 md:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
        {finding.evidenceChain.map((step) => {
          const isExpanded = expandedSteps[step.stepNumber] ?? true;

          return (
            <div key={step.stepNumber} className="relative">
              {/* Step Node Marker */}
              <div className="absolute -left-6 md:-left-8 top-3.5 w-6 h-6 md:w-8 md:h-8 rounded-full border border-slate-300 bg-white flex items-center justify-center text-xs font-bold text-slate-700 shadow-2xs z-10">
                {step.stepNumber}
              </div>

              {/* Step Content Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
                {/* Step Header */}
                <div
                  onClick={() => toggleStep(step.stepNumber)}
                  className="p-3.5 md:p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/50 hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        {step.title}
                        {step.uncertaintyFlag && (
                          <Badge variant="uncertain" size="sm">
                            Uncertainty Note
                          </Badge>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500">{step.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {step.primaryMetric && (
                      <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-xs">
                        <span className="text-slate-500">{step.primaryMetric.label}:</span>
                        <span className="font-bold text-slate-900 font-mono">{step.primaryMetric.value}</span>
                      </div>
                    )}
                    <button className="text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Step Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="p-4 space-y-3 text-xs"
                    >
                      {/* Human-Readable Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                            <span className="text-[10px] text-slate-400 block uppercase font-medium">
                              {detail.label}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
                              {detail.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Progressive Disclosure: Technical Rule Metadata */}
                      {showTechnicalDetails && (
                        <div className="p-3 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono space-y-1">
                          {step.ruleTrace && (
                            <div>
                              <span className="text-slate-400 block">Rule Definition:</span>
                              <span className="text-emerald-400">
                                {step.ruleTrace.ruleId} (v{step.ruleTrace.ruleVersion})
                              </span>
                            </div>
                          )}
                          {step.sourceTrace && (
                            <div>
                              <span className="text-slate-400 block">Source Trace:</span>
                              <span>
                                {step.sourceTrace.documentName} • Section: {step.sourceTrace.section} (Page {step.sourceTrace.page})
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Uncertainty note if flagged */}
                      {step.uncertaintyFlag && step.uncertaintyReason && (
                        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{step.uncertaintyReason}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
