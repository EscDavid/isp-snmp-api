import { OLTVendor } from '../../../shared/types/snmp.types.js';
import { GenericSnmpAdapter } from './generic.adapter.js';

export class ZteSnmpAdapter extends GenericSnmpAdapter {
  override readonly vendor = OLTVendor.ZTE;
}
