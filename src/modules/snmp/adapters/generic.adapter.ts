import snmp from 'net-snmp';
import { OLTVendor, SNMPResult } from '../../../shared/types/snmp.types.js';
import { SnmpAdapter, SnmpGetParams } from './snmp-adapter.interface.js';

import type { Varbind } from 'net-snmp';

function mapVarbindToResult(oid: string, varbind: Varbind): SNMPResult {
  if (snmp.isVarbindError(varbind)) {
    throw new Error(`SNMP error for OID ${oid}: ${snmp.varbindError(varbind)}`);
  }

  return {
    oid,
    type: snmp.ObjectType[varbind.type] ?? String(varbind.type),
    value: varbind.value,
    timestamp: new Date(),
  };
}

export class GenericSnmpAdapter implements SnmpAdapter {
  readonly vendor: OLTVendor = OLTVendor.GENERIC;

  async get({ oid, connection }: SnmpGetParams): Promise<SNMPResult> {
    const session = snmp.createSession(connection.host, connection.community, {
      port: connection.port ?? 161,
      retries: connection.retries,
      timeout: connection.timeout,
      transport: 'udp4',
      version: snmp.Version2c,
    });

    const response = await new Promise<SNMPResult>((resolve, reject) => {
      session.get([oid], (error, varbinds) => {
        if (error) {
          reject(error);
          return;
        }

        const varbind = varbinds[0];
        if (!varbind) {
          reject(new Error(`No SNMP response for OID ${oid}`));
          return;
        }

        try {
          resolve(mapVarbindToResult(oid, varbind));
        } catch (mapError) {
          reject(mapError);
        }
      });
    });

    session.close();

    return response;
  }
}
