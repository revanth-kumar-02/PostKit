import { AIProviderType } from './config';

export interface StorageSchema {
  theme: 'dark' | 'light' | 'system';
  selectedProvider: AIProviderType;
  groqApiKey?: string;
  ollamaBaseUrl: string;
  lastActiveTab?: string;
  debugMode: boolean;
}

export type StorageKey = keyof StorageSchema;
