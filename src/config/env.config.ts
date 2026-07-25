import type { AppEnvConfig, EnvironmentMode } from '@/types/config';

const getEnvMode = (): EnvironmentMode => {
  const mode = import.meta.env.MODE;
  if (mode === 'production') return 'production';
  if (mode === 'test') return 'test';
  return 'development';
};

export const envConfig: AppEnvConfig = Object.freeze({
  mode: getEnvMode(),
  isDev: import.meta.env.DEV ?? false,
  isProd: import.meta.env.PROD ?? false,
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  ollamaBaseUrl: import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434',
});
