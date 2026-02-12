import Fastify, { FastifyError } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { logger } from '../shared/logger/winston.config.js';
import { healthRoutes } from './routes/health.routes.js';
import { snmpRoutes } from './routes/v1/snmp.routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: false,
    trustProxy: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  await app.register(cors, {
    origin: true,
  });

  await app.register(rateLimit, {
    max: 60,
    timeWindow: '1 minute',
  });

  await app.register(healthRoutes);
  await app.register(async (v1App) => {
    await v1App.register(snmpRoutes, { prefix: '/snmp' });
  }, { prefix: '/api/v1' });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    logger.error('Request error', {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
    });

    const statusCode = error.statusCode || 500;

    void reply.status(statusCode).send({
      status: 'error',
      message: error.message,
    });
  });

  return app;
}
