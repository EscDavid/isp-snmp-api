import { OLTVendor, SNMPResult } from '../../../shared/types/snmp.types.js';

export interface SnmpConnectionConfig {
  host: string;
  port?: number;
  community: string;
  timeout: number;
  retries: number;
}

export interface SnmpGetParams {
  oid: string;
  connection: SnmpConnectionConfig;
}

export interface SnmpAdapter {
  readonly vendor: OLTVendor;
  get(params: SnmpGetParams): Promise<SNMPResult>;
}
