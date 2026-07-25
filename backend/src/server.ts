import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = buildApp();

async function start() {
  try {
    const address = await app.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info(`PostKit Backend API server listening at ${address}`);
  } catch (err) {
    logger.error({ err }, 'Failed to start PostKit Backend server');
    process.exit(1);
  }
}

start();
