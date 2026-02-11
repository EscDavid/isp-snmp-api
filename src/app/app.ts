import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { logger } from '../shared/logger/winston.config.js';
import { env } from '../shared/config/env.validator.js';

export async function buildApp() {
  const app = Fastify({
    logger: false, // Usamos winston
    trustProxy: true,
  });

  // Security plugins
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

  // Health check
  app.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    };
  });

  // Error handler
  app.setErrorHandler((error, request, reply) => {
    logger.error('Request error', {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
    });

    reply.status(error.statusCode || 500).send({
      status: 'error',
      message: error.message,
    });
  });

  return app;
}