import type { IAIProvider } from './provider.interface';
import { GroqProvider } from './groq.provider';
import type { AIRequestPayload, AIResponsePayload } from '@/types/ai';
import { validateIdeaInput } from '@/utils/validator';
import { logger } from '@/lib/logger';

export class AIService {
  private activeProvider: IAIProvider;
  private providers: Map<string, IAIProvider> = new Map();
  private activeAbortController: AbortController | null = null;

  constructor() {
    const groqProvider = new GroqProvider();
    this.providers.set(groqProvider.id, groqProvider);
    this.activeProvider = groqProvider;
  }

  public setProvider(providerId: string): boolean {
    const provider = this.providers.get(providerId);
    if (provider) {
      this.activeProvider = provider;
      logger.info(`AI Service active provider set to: ${provider.name}`);
      return true;
    }
    return false;
  }

  public getActiveProviderName(): string {
    return this.activeProvider.name;
  }

  public cancelCurrentRequest(): void {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
      logger.info('In-flight AI generation request cancelled.');
    }
  }

  public async generate(payload: AIRequestPayload): Promise<AIResponsePayload> {
    this.cancelCurrentRequest();

    const validation = validateIdeaInput(payload.idea);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || 'Invalid post idea input.',
      };
    }

    this.activeAbortController = new AbortController();
    const signal = this.activeAbortController.signal;

    try {
      logger.info(`Submitting post generation request for topic "${payload.idea.slice(0, 30)}"...`);
      const response = await this.activeProvider.generate(payload, { signal });
      this.activeAbortController = null;
      return response;
    } catch (err) {
      this.activeAbortController = null;
      logger.error('Unhandled exception in AIService:', err);
      return {
        success: false,
        error: 'An unexpected error occurred during post generation.',
      };
    }
  }
}

export const aiService = new AIService();
