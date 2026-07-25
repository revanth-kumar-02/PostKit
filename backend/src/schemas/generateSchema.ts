import { z } from 'zod';

export const generateRequestSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long.'),
  tone: z.string().default('Storytelling'),
  audience: z.string().default('Developers'),
  length: z.string().default('Medium'),
});

export type GenerateRequestPayload = z.infer<typeof generateRequestSchema>;
