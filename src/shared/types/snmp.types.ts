export enum SNMPVersion {
    V2C = '2c',
    V3 = '3',
  }
  
  export enum SNMPOperation {
    GET = 'GET',
    GETNEXT = 'GETNEXT',
    WALK = 'WALK',
    SET = 'SET',
  }
  
  export enum OLTVendor {
    HUAWEI = 'huawei',
    ZTE = 'zte',
    GENERIC = 'generic',
  }
  
  export interface SNMPOptions {
    timeout?: number;
    retries?: number;
    maxRepetitions?: number;
  }
  
  export interface SNMPResult {
    oid: string;
    type: string;
    value: any;
    timestamp: Date;
  }
  
  export interface OLTConfig {
    id: string;
    name: string;
    ipAddress: string;
    vendor: OLTVendor;
    snmpVersion: SNMPVersion;
    secretRef: string;
    status: 'active' | 'inactive' | 'unreachable';
  }