import { AuditService } from '../audit/audit.service.js';
import { OidPolicyService } from '../security/oid-policy.service.js';
import { OLTVendor, SNMPResult } from '../../shared/types/snmp.types.js';
import { UnsupportedVendorError } from '../../shared/errors/app-error.js';
import { normalizeOid } from './oid-normalizer.js';
import { GenericSnmpAdapter } from './adapters/generic.adapter.js';
import { HuaweiSnmpAdapter } from './adapters/huawei.adapter.js';
import { SnmpAdapter, SnmpConnectionConfig } from './adapters/snmp-adapter.interface.js';
import { ZteSnmpAdapter } from './adapters/zte.adapter.js';

export interface SnmpGetRequest {
  vendor: OLTVendor;
  oid: string;
  connection: SnmpConnectionConfig;
}

export class SnmpService {
  private readonly adapters: Map<OLTVendor, SnmpAdapter>;

  constructor(
    adapters?: SnmpAdapter[],
    private readonly oidPolicyService = new OidPolicyService(),
    private readonly auditService = new AuditService()
  ) {
    const registeredAdapters = adapters ?? [
      new GenericSnmpAdapter(),
      new HuaweiSnmpAdapter(),
      new ZteSnmpAdapter(),
    ];

    this.adapters = new Map(registeredAdapters.map((adapter) => [adapter.vendor, adapter]));
  }

  async get(request: SnmpGetRequest): Promise<SNMPResult> {
    const startedAt = Date.now();
    const normalizedOid = normalizeOid(request.oid);

    this.oidPolicyService.assertAllowed(normalizedOid);

    const adapter = this.adapters.get(request.vendor);
    if (!adapter) {
      throw new UnsupportedVendorError(request.vendor);
    }

    try {
      const response = await adapter.get({
        oid: normalizedOid,
        connection: request.connection,
      });

      await this.auditService.recordEvent({
        eventType: 'snmp.get',
        vendor: request.vendor,
        oid: normalizedOid,
        targetHost: request.connection.host,
        latencyMs: Date.now() - startedAt,
        status: 'success',
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown SNMP error';

      await this.auditService.recordEvent({
        eventType: 'snmp.get',
        vendor: request.vendor,
        oid: normalizedOid,
        targetHost: request.connection.host,
        latencyMs: Date.now() - startedAt,
        status: 'error',
        errorMessage,
      });

      throw error;
    }
  }
}
