import { describe, expect, it } from 'vitest';
import { normalizeOid } from '../../src/modules/snmp/oid-normalizer.js';

describe('normalizeOid', () => {
  it('removes leading dot', () => {
    expect(normalizeOid('.1.3.6.1.2.1.1.1.0')).toBe('1.3.6.1.2.1.1.1.0');
  });

  it('throws for invalid oid format', () => {
    expect(() => normalizeOid('abc')).toThrowError('OID format is invalid');
  });
});
