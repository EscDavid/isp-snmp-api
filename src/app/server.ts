import { buildApp } from './app.js';
import { env } from '../shared/config/env.validator.js';
import { logger } from '../shared/logger/winston.config.js';

async function start() {
  try {
    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    logger.info(`🚀 Server running on http://${env.HOST}:${env.PORT}`);
    logger.info(`📊 Health check: http://${env.HOST}:${env.PORT}/health`);
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

start();