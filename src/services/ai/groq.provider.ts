import type { IAIProvider, GenerateOptions } from './provider.interface';
import type { AIRequestPayload, AIResponsePayload } from '@/types/ai';
import { envConfig } from '@/config/env.config';
import { httpClient } from '@/lib/fetch';
import { AppError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { responseParser } from './response.parser';

interface GroqChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

export class GroqProvider implements IAIProvider {
  public readonly id = 'groq';
  public readonly name = 'Groq Cloud AI';
  private readonly baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly defaultModel = 'llama-3.3-70b-versatile';

  public isConfigured(): boolean {
    return Boolean(envConfig.groqApiKey && envConfig.groqApiKey.trim().length > 0);
  }

  public async generate(payload: AIRequestPayload, options: GenerateOptions = {}): Promise<AIResponsePayload> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Groq API key is missing. Please configure VITE_GROQ_API_KEY in your environment.',
        provider: this.id,
      };
    }

    try {
      const systemPrompt = options.systemPrompt || 'You are an authentic technical storyteller for LinkedIn. Return JSON only.';
      const userPrompt = options.userPrompt || `Write a post about: "${payload.idea}"`;

      logger.info(`Sending post generation request to Groq API (${payload.postType}, ${payload.tone}, ${payload.length})`);

      const response = await httpClient<GroqChatCompletionResponse>(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${envConfig.groqApiKey}`,
        },
        body: {
          model: this.defaultModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          max_tokens: 1500,
          temperature: 0.7,
        },
        timeoutMs: 30000,
        signal: options.signal,
      });

      if (!response || !response.choices || response.choices.length === 0) {
        throw new AppError('ERR_MALFORMED', 'Received empty choice selection from Groq API.', 'error');
      }

      const rawText = response.choices[0].message?.content || '';
      const generatedPost = responseParser.parse(rawText);

      logger.info('Groq API post generation succeeded.');

      return {
        success: true,
        message: 'Post generated successfully.',
        provider: this.id,
        post: generatedPost,
        rawText,
      };
    } catch (err) {
      if (err instanceof AppError) {
        if (err.code === 'ERR_ABORTED') {
          return {
            success: false,
            error: 'Generation cancelled.',
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
        error: 'Failed to generate post via Groq API. Please try again.',
        provider: this.id,
      };
    }
  }
}
