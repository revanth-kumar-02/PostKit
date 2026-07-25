import type { IAIProvider, GenerateOptions } from './provider.interface';
import type { AIRequestPayload, AIResponsePayload } from '@/types/ai';
import { httpClient } from '@/lib/fetch';
import { AppError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

interface BackendGenerateResponse {
  success: boolean;
  storyPlan?: unknown;
  post?: {
    hook: string;
    body: string;
    reflection?: string;
    cta: string;
    hashtags: string[];
  };
  qualityScore?: number;
  error?: {
    code: string;
    message: string;
  };
}

export class GroqProvider implements IAIProvider {
  public readonly id = 'backend-groq';
  public readonly name = 'PostKit BFF Backend';
  private readonly backendUrl = 'http://localhost:3000/api/generate';

  public isConfigured(): boolean {
    return true; // Configured on backend
  }

  public async generate(payload: AIRequestPayload, options: GenerateOptions = {}): Promise<AIResponsePayload> {
    try {
      logger.info(`Sending generation request to PostKit Backend BFF (${payload.idea.slice(0, 30)})`);

      const response = await httpClient<BackendGenerateResponse>(this.backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          topic: payload.idea,
          tone: payload.tone,
          audience: payload.audience,
          length: payload.length,
        },
        timeoutMs: 35000,
        signal: options.signal,
      });

      if (!response.success || !response.post) {
        throw new AppError(
          'ERR_BACKEND_FAILURE',
          response.error?.message || 'Backend post generation failed.',
          'error'
        );
      }

      logger.info('Backend BFF post generation succeeded.');

      return {
        success: true,
        message: 'Post generated successfully via PostKit Backend.',
        provider: this.id,
        post: response.post,
      };
    } catch (err) {
      if (err instanceof AppError) {
        if (err.code === 'ERR_ABORTED') {
          return {
            success: false,
            error: 'Generation request cancelled.',
            provider: this.id,
          };
        }
        return {
          success: false,
          error: err.message,
          provider: this.id,
        };
      }

      return {
        success: false,
        error: 'Failed to connect to PostKit Backend API at http://localhost:3000. Ensure backend server is running.',
        provider: this.id,
      };
    }
  }
}
