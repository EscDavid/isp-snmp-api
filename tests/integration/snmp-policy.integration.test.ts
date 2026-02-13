import { describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app/app.js';

describe('SNMP OID policy integration', () => {
  it('returns 403 when OID is blocked by policy', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/snmp/get',
      payload: {
        vendor: 'generic',
        oid: '1.3.6.1.6.3.15.1.2.2',
        connection: {
          host: '127.0.0.1',
          community: 'public',
          timeout: 1000,
          retries: 0,
        },
      },
    });

    expect(response.statusCode).toBe(403);
    const payload = response.json();
    expect(payload.code).toBe('OID_BLOCKED');

    await app.close();
  });
});
