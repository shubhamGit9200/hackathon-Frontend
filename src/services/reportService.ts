import { Report, Parameter, RiskSignal, AnomalySignal, ConsistencyCheck, ReportFileType } from '@/types';
import { MOCK_REPORTS } from '@/data';
import { parseRawMedicalText, validateMedicalDocument, extractReportMetadata } from '@/lib/medicalParser';
import { findingService } from './findingService';

class ReportService {
  private reports: Report[] = [...MOCK_REPORTS];
  private parametersMap: Record<string, Parameter[]> = {};
  private signalsMap: Record<
    string,
    {
      riskSignals: RiskSignal[];
      anomalySignals: AnomalySignal[];
      consistencyChecks: ConsistencyCheck[];
    }
  > = {};

  async getReports(patientId?: string): Promise<Report[]> {
    return new Promise((resolve) => {
      let list = [...this.reports];
      if (patientId) {
        list = list.filter((r) => r.patientId === patientId);
      }
      setTimeout(() => resolve(list), 80);
    });
  }

  async getReportById(id: string): Promise<Report | null> {
    return new Promise((resolve) => {
      const report = this.reports.find((r) => r.id === id) || null;
      setTimeout(() => resolve(report ? { ...report } : null), 60);
    });
  }

  async getParametersByReportId(reportId: string): Promise<Parameter[]> {
    return new Promise((resolve) => {
      const params = this.parametersMap[reportId] || [];
      setTimeout(() => resolve([...params]), 80);
    });
  }

  async getSignalsByReportId(
    reportId: string
  ): Promise<{
    riskSignals: RiskSignal[];
    anomalySignals: AnomalySignal[];
    consistencyChecks: ConsistencyCheck[];
  }> {
    return new Promise((resolve) => {
      const signals = this.signalsMap[reportId] || {
        riskSignals: [],
        anomalySignals: [],
        consistencyChecks: [],
      };
      setTimeout(() => resolve({ ...signals }), 80);
    });
  }

  async uploadReport(
    patientId: string,
    patientName: string,
    fileInfo: { name: string; size: number; type: string },
    title: string,
    labName: string,
    rawPastedText?: string
  ): Promise<Report> {
    const ext = fileInfo.name.split('.').pop()?.toUpperCase();
    const fileType: ReportFileType = ext === 'PNG' ? 'PNG' : ext === 'JPG' || ext === 'JPEG' ? 'JPG' : 'PDF';
    const reportId = `rep-${Date.now().toString().slice(-5)}`;

    // Strictly parse the actual provided text (zero hardcoded fallback)
    const textToParse = rawPastedText?.trim() || '';

    if (!textToParse) {
      throw new Error('No clinical text found in report. Please ensure your report has readable text or enter the test results.');
    }

    // Strict Clinical Guardrail: Validate that document is a real medical/laboratory report
    const validation = validateMedicalDocument(textToParse);
    if (!validation.isValid) {
      throw new Error(validation.rejectionReason || 'Invalid Medical Document: Only clinical laboratory reports are accepted.');
    }

    const metadata = extractReportMetadata(textToParse);
    const finalPatientName = metadata.patientName || patientName || 'Patient';
    const finalLabName = metadata.labName || labName || 'Clinical Diagnostic Center';
    const finalDate = metadata.reportDate ? new Date().toISOString() : new Date().toISOString();

    const parsed = parseRawMedicalText(textToParse, reportId, finalPatientName);

    if (parsed.parameters.length === 0) {
      throw new Error('No recognized laboratory parameters detected in this report text. Please verify the parameter names and values.');
    }

    // Save parameters and signals in maps
    this.parametersMap[reportId] = parsed.parameters;
    this.signalsMap[reportId] = {
      riskSignals: parsed.riskSignals,
      anomalySignals: parsed.anomalySignals,
      consistencyChecks: parsed.consistencyChecks,
    };

    // Register findings into findingService
    findingService.addFindings(parsed.findings);

    const newReport: Report = {
      id: reportId,
      patientId,
      patientName: finalPatientName,
      title: title || `${fileInfo.name.replace(/\.[^/.]+$/, '')} Report`,
      fileType,
      fileName: fileInfo.name,
      fileSizeBytes: fileInfo.size,
      uploadedAt: new Date().toISOString(),
      labName: finalLabName,
      sampleCollectionDate: finalDate,
      reportDate: finalDate,
      status: 'QUEUED',
      processingProgress: 0,
      extractedParametersCount: parsed.parameters.length,
      flaggedFindingsCount: parsed.findings.length,
      criticalSignalsCount: parsed.findings.filter((f) => f.priority === 'CRITICAL').length,
    };

    this.reports.unshift(newReport);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...newReport }), 200);
    });
  }

  async updateReportProgress(reportId: string, progress: number, status: Report['status']): Promise<Report | null> {
    const rep = this.reports.find((r) => r.id === reportId);
    if (!rep) return null;
    rep.processingProgress = progress;
    rep.status = status;
    return { ...rep };
  }
}

export const reportService = new ReportService();
