import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000').transform((val) => parseInt(val, 10)),
  GROQ_API_KEY: z.string().min(1, 'GROQ_API_KEY is required in backend .env'),
  CORS_ORIGIN: z.string().default('*'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables in backend:', parsed.error.format());
  throw new Error('Invalid backend configuration');
}

export const env = parsed.data;
