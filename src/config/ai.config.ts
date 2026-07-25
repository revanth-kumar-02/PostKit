import { AIProviderType, type AIProviderConfig } from '@/types/config';

export const AI_PROVIDERS: Record<AIProviderType, AIProviderConfig> = Object.freeze({
  [AIProviderType.GROQ]: {
    id: AIProviderType.GROQ,
    name: 'Groq Cloud AI',
    isLocal: false,
    defaultModel: 'llama-3.3-70b-versatile',
    availableModels: [
      'llama-3.3-70b-versatile',
      'llama3-8b-8192',
      'mixtral-8x7b-32768',
    ],
  },
  [AIProviderType.OLLAMA]: {
    id: AIProviderType.OLLAMA,
    name: 'Ollama (Local)',
    isLocal: true,
    defaultModel: 'llama3:latest',
    availableModels: ['llama3:latest', 'mistral:latest', 'gemma2:latest'],
  },
});
