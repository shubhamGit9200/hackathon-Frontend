'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/design-system';
import { APP_CONFIG, CLINICAL_SAFETY_DISCLAIMERS } from '@/constants';
import { SlidersHorizontal, BookOpen, ShieldCheck, Database, CheckCircle2, Lock } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-brand-600" />
          Clinical Reference Framework & Standards
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Active reference ranges, rule engine definitions, and safety boundary configurations
        </p>
      </div>

      {/* Harmonized Reference Frameworks Card */}
      <Card className="border border-slate-200 shadow-card bg-white p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Active Guidelines & Reference Standards
            </h3>
            <p className="text-xs text-slate-500">
              Versioned reference boundaries applied across adult male and female cohorts
            </p>
          </div>
          <Badge variant="normal" size="sm">
            {APP_CONFIG.rulesetVersion}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
            <span className="font-bold text-slate-900 block">ICMR / WHO Hemogram Standard (Adults)</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Hemoglobin, RBC indices (MCV 80-100 fL, MCH 27-32 pg, RDW 11.5-14.5%), platelet, and differential leucocyte benchmarks.
            </p>
            <span className="font-mono text-[10px] text-slate-400 block pt-1">Ruleset: RULE-VER-HEM-v2026.2</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
            <span className="font-bold text-slate-900 block">RSSDI / ADA Glycemic Control Standard</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              HbA1c (&lt; 5.7% Non-diabetic, &lt; 7.0% Therapeutic Target), eAG, and Fasting Blood Sugar threshold definitions.
            </p>
            <span className="font-mono text-[10px] text-slate-400 block pt-1">Ruleset: RULE-MET-GLYCEMIC-v1.4</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
            <span className="font-bold text-slate-900 block">KDIGO / CKD-EPI 2021 Renal Equations</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Serum Creatinine, Blood Urea Nitrogen (BUN), and eGFR staging algorithms without race multipliers.
            </p>
            <span className="font-mono text-[10px] text-slate-400 block pt-1">Ruleset: RULE-RENAL-KDIGO-v2.0</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
            <span className="font-bold text-slate-900 block">Lipid Association of India (LAI) Standard</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Total Cholesterol (&lt; 200 mg/dL), Triglycerides (&lt; 150 mg/dL), HDL (&gt; 40 mg/dL), and LDL targets.
            </p>
            <span className="font-mono text-[10px] text-slate-400 block pt-1">Ruleset: RULE-LIPID-LAI-v1.2</span>
          </div>
        </div>
      </Card>

      {/* Safety Disclaimers & Rules Card */}
      <Card className="border border-slate-200 shadow-card bg-white p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          Product Safety & Language Rules (Built-in Enforcement)
        </h3>

        <div className="p-4 rounded-xl bg-slate-50 border text-xs text-slate-700 space-y-2 leading-relaxed">
          <p>
            MedVerify AI strictly enforces non-prescriptive, explainable medical language across all patient and clinician screens. Prohibited patterns such as definitive autonomous diagnosis, medicine dosage prescriptions, or untraceable certainty claims are blocked by system architecture.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
            <li>Patient explanations present everyday bodily effects rather than definitive disease claims.</li>
            <li>All multi-parameter anomalies require explicit clinician sign-off in the review queue.</li>
            <li>Source document regions and OCR confidence scores are permanently attached to every extracted parameter.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
