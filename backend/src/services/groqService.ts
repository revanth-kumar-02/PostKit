import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { withRetry } from '../utils/retry.js';
import { LLMTimeoutError, LLMProviderError } from '../utils/errors.js';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  messages: LLMMessage[];
  jsonOutput?: boolean;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}

export interface LLMProvider {
  id: string;
  name: string;
  generate(options: LLMOptions): Promise<string>;
}

export class GroqService implements LLMProvider {
  public id = 'groq';
  public name = 'Groq Provider';
  private baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private model = 'llama-3.3-70b-versatile';

  public async generate(options: LLMOptions): Promise<string> {
    return withRetry(async () => {
      const controller = new AbortController();
      const timeoutMs = options.timeoutMs || 20000;
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        logger.info(`Sending request to Groq API (${this.model})...`);

        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.model,
            messages: options.messages,
            response_format: options.jsonOutput ? { type: 'json_object' } : undefined,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature ?? 0.7,
          }),
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          logger.error(`Groq API returned error status ${response.status}: ${errText}`);
          throw new LLMProviderError(`Groq API error: status ${response.status}`, response.status);
        }

        const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
        const content = data.choices?.[0]?.message?.content || '';

        if (!content) {
          throw new LLMProviderError('Groq API returned empty response.');
        }

        return content;
      } catch (err: unknown) {
        clearTimeout(timer);
        if (err instanceof Error && err.name === 'AbortError') {
          throw new LLMTimeoutError(`Groq generation timed out after ${timeoutMs}ms.`);
        }
        throw err;
      }
    });
  }
}

export const groqService = new GroqService();
