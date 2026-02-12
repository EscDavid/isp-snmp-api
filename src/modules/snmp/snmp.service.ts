import { OLTVendor, SNMPResult } from '../../shared/types/snmp.types.js';
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

  constructor(adapters?: SnmpAdapter[]) {
    const registeredAdapters = adapters ?? [
      new GenericSnmpAdapter(),
      new HuaweiSnmpAdapter(),
      new ZteSnmpAdapter(),
    ];

    this.adapters = new Map(registeredAdapters.map((adapter) => [adapter.vendor, adapter]));
  }

  async get(request: SnmpGetRequest): Promise<SNMPResult> {
    const normalizedOid = normalizeOid(request.oid);
    const adapter = this.adapters.get(request.vendor);

    if (!adapter) {
      throw new Error(`Unsupported vendor: ${request.vendor}`);
    }

    return adapter.get({
      oid: normalizedOid,
      connection: request.connection,
    });
  }
}
