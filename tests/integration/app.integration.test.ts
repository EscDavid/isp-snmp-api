import { describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app/app.js';

describe('API integration', () => {
  it('returns health status', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.status).toBe('ok');

    await app.close();
  });

  it('rejects invalid SNMP GET payload', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/snmp/get',
      payload: {
        vendor: 'generic',
        oid: 'invalid-oid',
      },
    });

    expect(response.statusCode).toBe(400);

    await app.close();
  });
});
