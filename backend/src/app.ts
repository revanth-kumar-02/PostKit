import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRoutes } from './routes/health.js';
import { generateRoutes } from './routes/generate.js';

export function buildApp() {
  const app = Fastify({
    logger: false,
  });

  // CORS Registration
  app.register(cors, {
    origin: env.CORS_ORIGIN === '*' ? true : [env.CORS_ORIGIN],
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  // Error Handler
  app.setErrorHandler(errorHandler);

  // Register Routes
  app.register(healthRoutes);
  app.register(generateRoutes);

  return app;
}
