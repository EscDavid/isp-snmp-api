import { describe, expect, it } from 'vitest';
import { OidPolicyService } from '../../src/modules/security/oid-policy.service.js';

describe('OidPolicyService', () => {
  it('allows OIDs inside allowlist', () => {
    const service = new OidPolicyService({
      allowPrefixes: ['1.3.6.1.2.1'],
      denyPrefixes: ['1.3.6.1.6.3.15'],
    });

    expect(() => service.assertAllowed('1.3.6.1.2.1.1.1.0')).not.toThrow();
  });

  it('blocks OIDs in denylist', () => {
    const service = new OidPolicyService({
      allowPrefixes: [],
      denyPrefixes: ['1.3.6.1.6.3.15'],
    });

    expect(() => service.assertAllowed('1.3.6.1.6.3.15.1.2.2')).toThrowError('OID is blocked by policy');
  });
});
