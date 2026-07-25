import type { FastifyInstance } from 'fastify';
import { generateRequestSchema } from '../schemas/generateSchema.js';
import { handleGeneratePost } from '../controllers/generateController.js';

export async function generateRoutes(app: FastifyInstance) {
  app.post(
    '/api/generate',
    {
      schema: {
        body: generateRequestSchema,
      },
    },
    handleGeneratePost
  );
}
