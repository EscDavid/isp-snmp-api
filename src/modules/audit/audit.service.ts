import { env } from '../../shared/config/env.validator.js';
import { logger } from '../../shared/logger/winston.config.js';
import { AuditEvent, AuditRepository } from './audit.repository.js';

export class AuditService {
  constructor(
    private readonly repository = new AuditRepository(),
    private readonly isPersistenceEnabled = env.AUDIT_PERSISTENCE_ENABLED
  ) {}

  async recordEvent(event: AuditEvent): Promise<void> {
    logger.info('SNMP audit event', event);

    if (!this.isPersistenceEnabled) {
      return;
    }

    await this.repository.createEvent(event);
  }
}
