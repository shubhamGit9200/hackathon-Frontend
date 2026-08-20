'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { APP_CONFIG } from '@/constants';
import { Modal, Button, Input, Select, ProgressBar, Alert } from '@/design-system';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { reportService } from '@/services/reportService';
import { auditService } from '@/services/auditService';
import { extractTextFromFile } from '@/lib/ocrService';
import { MOCK_PATIENTS } from '@/data/patients';
import { formatBytes } from '@/lib/utils';
import { UploadCloud, FileText, CheckCircle2, Clipboard, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const UploadModal: React.FC = () => {
  const router = useRouter();
  const { isUploadModalOpen, setUploadModalOpen, setSelectedReportId, addToast } = useAppStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'PASTE' | 'FILE'>('PASTE');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanMessage, setScanMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [labName, setLabName] = useState('');
  const [patientId, setPatientId] = useState(MOCK_PATIENTS[0]?.id || 'pat-1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = async (droppedFile: File) => {
    setError(null);
    const ext = droppedFile.name.split('.').pop()?.toUpperCase();

    if (!ext || !APP_CONFIG.supportedFormats.includes(ext as any)) {
      setError(`Unsupported file format (.${ext}). Supported formats: ${APP_CONFIG.supportedFormats.join(', ')}`);
      return;
    }

    if (droppedFile.size > APP_CONFIG.maxFileSizeBytes) {
      setError(`File size exceeds maximum allowable limit of ${APP_CONFIG.maxFileSizeLabel}`);
      return;
    }

    setFile(droppedFile);
    if (!reportTitle) {
      setReportTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
    }

    // Run in-browser OCR / text extraction
    setIsScanning(true);
    setScanMessage('Scanning document text...');
    try {
      const text = await extractTextFromFile(droppedFile, (p, stage) => {
        setScanMessage(stage);
      });
      if (text && text.trim().length > 0) {
        setPastedText(text);
      }
    } catch (err) {
      console.warn('Scan info:', err);
    } finally {
      setIsScanning(false);
      setScanMessage('');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'FILE' && !file && !pastedText.trim()) {
      setError('Please select a laboratory report file or paste report text.');
      return;
    }

    if (activeTab === 'PASTE' && !pastedText.trim()) {
      setError('Please paste your laboratory report text.');
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setProcessingStage('Reading report contents...');

    const patient = MOCK_PATIENTS.find((p) => p.id === patientId) || MOCK_PATIENTS[0];

    try {
      let textToUse = pastedText.trim();

      // If text hasn't finished scanning yet, scan file now
      if (!textToUse && file) {
        setProcessingStage('Scanning document via in-browser OCR...');
        setProgress(25);
        textToUse = await extractTextFromFile(file, (p, s) => {
          setProgress(p);
          setProcessingStage(s);
        });
      }

      if (!textToUse) {
        throw new Error('No readable text found in document. Please paste the test values or enter them in the box.');
      }

      setProgress(45);
      setProcessingStage('Parsing clinical laboratory parameters...');

      const fileInfo = file
        ? { name: file.name, size: file.size, type: file.type }
        : {
            name: `${reportTitle || 'Pasted Medical Report'}.txt`,
            size: new Blob([textToUse]).size,
            type: 'text/plain',
          };

      const newReport = await reportService.uploadReport(
        patient.id,
        patient.fullName,
        fileInfo,
        reportTitle || (activeTab === 'PASTE' ? 'Pasted Medical Report' : file?.name || 'Laboratory Report'),
        labName || 'Reference Diagnostic Center',
        textToUse
      );

      // Smooth multi-step progression
      await new Promise((r) => setTimeout(r, 350));
      setProgress(75);
      setProcessingStage('Verifying values against standard ICMR & WHO reference benchmarks...');

      await new Promise((r) => setTimeout(r, 400));
      setProgress(90);
      setProcessingStage('Generating explainable clinical findings & evidence chain...');

      await new Promise((r) => setTimeout(r, 300));
      setProgress(100);
      setProcessingStage('Analysis complete.');

      await reportService.updateReportProgress(newReport.id, 100, 'COMPLETED');

      await auditService.logEvent({
        actorId: user.id,
        actorName: user.fullName,
        actorRole: user.role,
        action: 'REPORT_UPLOADED',
        resourceType: 'REPORT',
        resourceId: newReport.id,
        resourceSummary: `Processed report "${newReport.title}" (${newReport.extractedParametersCount} parameters extracted).`,
        metadata: { extractedCount: newReport.extractedParametersCount, patientName: patient.fullName },
      });

      setSelectedReportId(newReport.id);
      addToast({
        type: 'success',
        title: 'Report Analyzed Successfully',
        message: `Extracted ${newReport.extractedParametersCount} parameters and ${newReport.flaggedFindingsCount} findings from your report.`,
      });

      setTimeout(() => {
        setIsProcessing(false);
        setUploadModalOpen(false);
        setFile(null);
        setPastedText('');
        setProgress(0);
        setReportTitle('');
        setLabName('');
        router.push(`/reports/${newReport.id}`);
      }, 500);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err?.message || 'An error occurred while analyzing the report.');
    }
  };

  const patientOptions = MOCK_PATIENTS.map((p) => ({
    value: p.id,
    label: `${p.fullName} (${p.mrn})`,
  }));

  return (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={() => !isProcessing && setUploadModalOpen(false)}
      title="Analyze Medical Report"
      description="Paste raw laboratory text or upload a digital report document"
      maxWidth="xl"
    >
      {isProcessing ? (
        <div className="py-8 px-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-brand-600 shadow-subtle">
            <FileText className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-0.5">Analyzing Medical Report</h4>
            <p className="text-xs text-slate-500">{processingStage}</p>
          </div>

          <div className="max-w-md mx-auto">
            <ProgressBar progress={progress} showPercentage={true} variant="brand" size="sm" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Mode Selector Tabs */}
          <div className="flex border-b border-slate-200 gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('PASTE')}
              className={cn(
                'pb-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors',
                activeTab === 'PASTE'
                  ? 'border-brand-600 text-brand-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              )}
            >
              <Clipboard className="w-4 h-4" />
              <span>Paste Report Text</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('FILE')}
              className={cn(
                'pb-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors',
                activeTab === 'FILE'
                  ? 'border-brand-600 text-brand-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              )}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document (PDF / Image)</span>
            </button>
          </div>

          {/* Tab 1: Paste Report Text */}
          {activeTab === 'PASTE' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Paste Lab Report Text
                </label>
                <span className="text-[10px] text-slate-400">MedVerify verifies only provided test lines</span>
              </div>

              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={`Paste laboratory test results here, e.g.:\nHemoglobin: 10.5 g/dL\nPlatelet Count: 180000 /cumm\nFasting Blood Sugar: 124 mg/dL\nHbA1c: 7.2 %\nSerum Creatinine: 1.4 mg/dL\nTotal Cholesterol: 220 mg/dL`}
                className="w-full rounded-lg border border-slate-300 p-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                required
              />
            </div>
          )}

          {/* Tab 2: Upload File */}
          {activeTab === 'FILE' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Report Document</label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) {
                      handleFileDrop(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative p-5 rounded-xl border-2 border-dashed transition-colors cursor-pointer text-center overflow-hidden ${
                    isDragging
                      ? 'border-brand-500 bg-brand-50/50'
                      : file
                      ? 'border-brand-300 bg-brand-50/30'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  {isScanning && (
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-brand-500 to-transparent animate-pulse shadow-sm shadow-brand-500" />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileDrop(e.target.files[0]);
                    }}
                  />

                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{file.name}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span>{formatBytes(file.size)}</span>
                          {isScanning ? (
                            <span className="text-brand-600 font-semibold flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              {scanMessage || 'Scanning text...'}
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Ready for analysis
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-900">
                          Drag & drop report image / PDF, or <span className="text-brand-600 underline">browse</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          PNG, JPG, PDF, TXT (up to {APP_CONFIG.maxFileSizeLabel})
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Scanned/Detected Text Verification */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Report Parameters to Verify
                  </label>
                  <span className="text-[10px] text-slate-400">
                    MedVerify strictly analyzes only these lines
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={
                    isScanning
                      ? 'Scanning text from image...'
                      : `Enter or verify test values from your uploaded file, e.g.:\nTotal Cholesterol: 235 mg/dL\nTriglycerides: 195 mg/dL\nHDL Cholesterol: 42 mg/dL\nLDL Cholesterol: 154 mg/dL`
                  }
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Optional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <Input
              label="Report Title (Optional)"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="e.g. Complete Blood Count or Lipid Profile"
            />
            <Input
              label="Diagnostic Center / Lab (Optional)"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              placeholder="e.g. Apollo Diagnostics"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="md" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={activeTab === 'FILE' ? !file && !pastedText.trim() : !pastedText.trim()}
            >
              Analyze & Verify Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
