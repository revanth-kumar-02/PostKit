import { envConfig } from '@/config/env.config';
import type { AppEnvConfig } from '@/types/config';

export function useEnvironment(): AppEnvConfig {
  return envConfig;
}
