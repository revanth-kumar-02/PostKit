import type { GeneratedPost, StoryPlan, ValidationReport } from '@/types/ai';
import { hallucinationGuard } from './hallucinationGuard';
import { qualityChecker } from './qualityChecker';
import { logger } from '@/lib/logger';

export class OutputValidator {
  public validate(post: GeneratedPost, plan: StoryPlan): ValidationReport {
    const errors: string[] = [];
    const fullText = `${post.hook} ${post.body} ${post.reflection || ''} ${post.cta}`;

    // 1. Check for banned phrases
    const bannedFound = hallucinationGuard.detectBannedPhrases(fullText);
    if (bannedFound.length > 0) {
      errors.push(`Detected banned AI phrases: ${bannedFound.map((p) => `"${p}"`).join(', ')}`);
    }

    // 2. Check for hallucinated technologies
    const hasHallucination = hallucinationGuard.checkHallucinatedTech(fullText, plan);
    if (hasHallucination) {
      errors.push('Detected unmentioned technology stacks in generated text.');
    }

    // 3. Quality check (missing sections, repetition, hashtag count)
    const qualityIssues = qualityChecker.checkQuality(post);
    errors.push(...qualityIssues);

    const isValid = errors.length === 0;

    if (!isValid) {
      logger.warn('Post validation failed:', errors);
    } else {
      logger.info('Post validation passed with 0 issues.');
    }

    return {
      isValid,
      errors,
      hasHallucinations: hasHallucination,
      hasBannedWords: bannedFound.length > 0,
    };
  }
}

export const outputValidator = new OutputValidator();
