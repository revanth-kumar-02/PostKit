import type { FastifyInstance } from 'fastify';
import { handleGeneratePost } from '../controllers/generateController.js';

export async function generateRoutes(app: FastifyInstance) {
  app.post('/api/generate', handleGeneratePost);
}
