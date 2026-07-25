import type { HookEvaluationResult, StoryPlan } from '@/types/ai';
import { hallucinationGuard } from './hallucinationGuard';

export class HookEvaluator {
  private static readonly DISALLOWED_START_PREFIXES = [
    'i built',
    'i created',
    'i spent',
    "i'm excited",
    "i'm thrilled",
    'i am thrilled',
    'as a developer',
    'as a software engineer',
    'today i',
  ];

  public evaluate(candidateText: string, plan: StoryPlan): HookEvaluationResult {
    const text = candidateText.trim().replace(/^["']|["']$/g, '');
    const lower = text.toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);
    const reasons: string[] = [];

    // Rule 1: Must be under 18 words
    if (words.length > 18) {
      return {
        hook: text,
        score: 0,
        isValid: false,
        reasons: [`Exceeds max length of 18 words (${words.length} words)`],
      };
    }

    // Rule 2: Rejection of cliché prefixes
    for (const prefix of HookEvaluator.DISALLOWED_START_PREFIXES) {
      if (lower.startsWith(prefix)) {
        return {
          hook: text,
          score: 0,
          isValid: false,
          reasons: [`Starts with cliché phrase: "${prefix}"`],
        };
      }
    }

    // Rule 3: Rejection of banned AI words
    const banned = hallucinationGuard.detectBannedPhrases(text);
    if (banned.length > 0) {
      return {
        hook: text,
        score: 0,
        isValid: false,
        reasons: [`Contains banned phrase: "${banned[0]}"`],
      };
    }

    // Rule 4: Rejection of hallucinated technologies
    const hasForbiddenTech = hallucinationGuard.checkHallucinatedTech(text, plan);
    if (hasForbiddenTech) {
      return {
        hook: text,
        score: 0,
        isValid: false,
        reasons: ['Introduces forbidden unmentioned technology stack'],
      };
    }

    // Scoring calculation (0 to 10)
    let score = 0;

    // 1. Conciseness (0 to 2 pts): Ideal is 6 to 14 words
    if (words.length >= 6 && words.length <= 14) {
      score += 2.0;
    } else if (words.length < 6 || words.length <= 17) {
      score += 1.5;
    } else {
      score += 0.5;
    }

    // 2. Curiosity & Tension (0 to 2.5 pts)
    if (
      lower.includes('thought') ||
      lower.includes('underestimated') ||
      lower.includes('realized') ||
      lower.includes('unexpected') ||
      lower.includes('bug') ||
      lower.includes('stuck') ||
      lower.includes('learned') ||
      lower.includes('never') ||
      lower.includes('lesson')
    ) {
      score += 2.5;
    } else {
      score += 1.5;
    }

    // 3. Human Tone & Authenticity (0 to 2.5 pts)
    if (!lower.startsWith('the ') && !lower.startsWith('a ')) {
      score += 2.5; // Natural conversational start
    } else {
      score += 1.5;
    }

    // 4. LinkedIn Suitability & No Clichés (0 to 3.0 pts)
    score += 3.0;

    const finalScore = Math.min(Math.round(score * 10) / 10, 10);
    const isValid = finalScore >= 8.5;

    if (!isValid) {
      reasons.push(`Score ${finalScore}/10 is below required 8.5 threshold.`);
    }

    return {
      hook: text,
      score: finalScore,
      isValid,
      reasons,
    };
  }
}

export const hookEvaluator = new HookEvaluator();
