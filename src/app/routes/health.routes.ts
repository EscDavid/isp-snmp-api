import { FastifyInstance } from 'fastify';
import { env } from '../../shared/config/env.validator.js';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    };
  });
}
