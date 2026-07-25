import type { AppConfig } from '@/types/config';

export const APP_CONFIG: AppConfig = Object.freeze({
  name: 'PostKit V2',
  version: '2.0.0',
  description: 'AI-powered LinkedIn Post Creation Suite',
  author: 'PostKit Team',
  linkedinBaseUrl: 'https://www.linkedin.com',
  maxPostLength: 3000,
});

export const STORAGE_KEYS = Object.freeze({
  THEME: 'theme',
  SELECTED_PROVIDER: 'selectedProvider',
  GROQ_API_KEY: 'groqApiKey',
  OLLAMA_BASE_URL: 'ollamaBaseUrl',
  DEBUG_MODE: 'debugMode',
} as const);

export const LINKEDIN_DOM = Object.freeze({
  COMPOSER_CONTAINER_SELECTOR: 'div[role="textbox"]',
  POST_BUTTON_SELECTOR: 'button.share-actions__primary-action',
});
