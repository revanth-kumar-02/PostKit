import type { GeneratedPost } from '@/types/ai';
import { AppError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

export class ResponseParser {
  public parse(rawOutput: string): GeneratedPost {
    if (!rawOutput || typeof rawOutput !== 'string') {
      throw new AppError('ERR_EMPTY_RESPONSE', 'Received empty response from AI model.', 'error');
    }

    let cleaned = rawOutput.trim();

    // Strip markdown code block wrappers if present (e.g. ```json ... ```)
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      logger.error('Failed to parse AI JSON response:', cleaned, err);
      throw new AppError(
        'ERR_INVALID_JSON',
        'AI response could not be parsed as valid JSON. Please try again.',
        'error',
        err
      );
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new AppError('ERR_INVALID_POST', 'AI returned an invalid post format.', 'error');
    }

    const obj = parsed as Record<string, unknown>;

    const hook = typeof obj.hook === 'string' ? obj.hook.trim() : '';
    const body = typeof obj.body === 'string' ? obj.body.trim() : '';
    const reflection = typeof obj.reflection === 'string' ? obj.reflection.trim() : undefined;
    const cta = typeof obj.cta === 'string' ? obj.cta.trim() : '';

    if (!hook || !body) {
      throw new AppError('ERR_MISSING_FIELDS', 'Generated post is missing essential hook or body content.', 'error');
    }

    const rawHashtags = Array.isArray(obj.hashtags) ? obj.hashtags : [];
    const hashtags = this.sanitizeHashtags(rawHashtags);

    return {
      hook,
      body,
      reflection,
      cta,
      hashtags,
    };
  }

  private sanitizeHashtags(tags: unknown[]): string[] {
    const unique = new Set<string>();

    tags.forEach((tag) => {
      if (typeof tag === 'string') {
        let cleaned = tag.trim().toLowerCase();
        if (cleaned) {
          if (!cleaned.startsWith('#')) {
            cleaned = `#${cleaned}`;
          }
          // Remove spaces or invalid chars inside hashtag
          cleaned = cleaned.replace(/\s+/g, '');
          if (cleaned.length > 1) {
            unique.add(cleaned);
          }
        }
      }
    });

    const result = Array.from(unique);
    return result.slice(0, 6);
  }
}

export const responseParser = new ResponseParser();
