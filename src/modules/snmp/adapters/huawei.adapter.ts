import { OLTVendor } from '../../../shared/types/snmp.types.js';
import { GenericSnmpAdapter } from './generic.adapter.js';

export class HuaweiSnmpAdapter extends GenericSnmpAdapter {
  override readonly vendor = OLTVendor.HUAWEI;
}
