import { AuditEvent, SystemStats } from '@/types';
import { MOCK_AUDIT_EVENTS, MOCK_SYSTEM_STATS } from '@/data';

class AuditService {
  private auditEvents: AuditEvent[] = [...MOCK_AUDIT_EVENTS];
  private systemStats: SystemStats = { ...MOCK_SYSTEM_STATS };

  async getAuditLogs(): Promise<AuditEvent[]> {
    return new Promise((resolve) => {
      const sorted = [...this.auditEvents].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setTimeout(() => resolve(sorted), 100);
    });
  }

  async getSystemStats(): Promise<SystemStats> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.systemStats }), 80);
    });
  }

  async logEvent(eventData: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent> {
    const newEvent: AuditEvent = {
      ...eventData,
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditEvents.unshift(newEvent);
    return newEvent;
  }
}

export const auditService = new AuditService();
