export type EnvironmentMode = 'development' | 'production' | 'test';

export interface AppEnvConfig {
  mode: EnvironmentMode;
  isDev: boolean;
  isProd: boolean;
  groqApiKey?: string;
  ollamaBaseUrl: string;
  backendUrl: string;
}

export interface AppConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  linkedinBaseUrl: string;
  maxPostLength: number;
}

export const AIProviderType = {
  GROQ: 'groq',
  OLLAMA: 'ollama',
} as const;

export type AIProviderType = (typeof AIProviderType)[keyof typeof AIProviderType];

export interface AIProviderConfig {
  id: AIProviderType;
  name: string;
  isLocal: boolean;
  defaultModel: string;
  availableModels: string[];
}
