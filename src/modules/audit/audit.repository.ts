import { getDbPool } from '../../shared/database/client.js';

export interface AuditEvent {
  eventType: string;
  vendor: string;
  oid: string;
  targetHost: string;
  latencyMs: number;
  status: 'success' | 'error';
  errorMessage?: string;
}

export class AuditRepository {
  async createEvent(event: AuditEvent): Promise<void> {
    const pool = getDbPool();

    await pool.query(
      `INSERT INTO audit_events (
        event_type,
        vendor,
        oid,
        target_host,
        latency_ms,
        status,
        error_message,
        created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())`,
      [
        event.eventType,
        event.vendor,
        event.oid,
        event.targetHost,
        event.latencyMs,
        event.status,
        event.errorMessage ?? null,
      ]
    );
  }
}
