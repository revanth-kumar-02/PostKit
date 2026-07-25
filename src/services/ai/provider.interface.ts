import type { AIRequestPayload, AIResponsePayload } from '@/types/ai';

export interface GenerateOptions {
  systemPrompt?: string;
  userPrompt?: string;
  signal?: AbortSignal;
}

export interface IAIProvider {
  readonly id: string;
  readonly name: string;

  isConfigured(): boolean;
  generate(payload: AIRequestPayload, options?: GenerateOptions): Promise<AIResponsePayload>;
}
