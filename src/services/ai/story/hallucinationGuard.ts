import type { StoryPlan } from '@/types/ai';
import { logger } from '@/lib/logger';

export class HallucinationGuard {
  public static readonly BANNED_PHRASES = [
    'as a developer',
    'as a software engineer',
    "i'm excited to share",
    "i'm thrilled to announce",
    "i am thrilled",
    "i'm thrilled",
    "in today's fast-paced world",
    "in today's digital landscape",
    'leveraging',
    'game-changing',
    'cutting-edge',
    'simplify my workflow',
    'best practices',
    'unlock your potential',
    'this journey taught me',
    'delve into',
    'tapestry',
    'testament',
    'beacon',
    'synergy',
    'paradigm shift',
    'unlocking the power',
  ];

  public generateGuardInstructions(plan: StoryPlan): string {
    const knownBlock = plan.knownFacts.length > 0
      ? `EXPLICIT USER FACTS (ONLY USE THESE): \n- ${plan.knownFacts.join('\n- ')}`
      : 'EXPLICIT USER FACTS: User provided only a brief core idea.';

    const forbiddenBlock = `STRICT FACT BOUNDARIES (NEVER INVENT ANY OF THESE):\n- ${plan.forbiddenFacts.join('\n- ')}`;

    return `${knownBlock}\n\n${forbiddenBlock}`;
  }

  public detectBannedPhrases(text: string): string[] {
    const lower = text.toLowerCase();
    const found: string[] = [];

    HallucinationGuard.BANNED_PHRASES.forEach((phrase) => {
      if (lower.includes(phrase)) {
        found.push(phrase);
      }
    });

    return found;
  }

  public checkHallucinatedTech(text: string, plan: StoryPlan): boolean {
    const hasForbiddenTechRule = plan.forbiddenFacts.some((f) =>
      f.includes('programming languages')
    );

    if (!hasForbiddenTechRule) return false;

    // List of common tech names to verify if AI hallucinated specific tech stacks when forbidden
    const techKeywords = [
      'typescript', 'javascript', 'python', 'react', 'next.js', 'node', 'express',
      'django', 'fastapi', 'tailwind', 'docker', 'aws', 'postgres', 'mongodb'
    ];

    const lower = text.toLowerCase();
    for (const tech of techKeywords) {
      if (lower.includes(tech)) {
        logger.warn(`HallucinationGuard detected forbidden tech hallucination: "${tech}"`);
        return true;
      }
    }

    return false;
  }
}

export const hallucinationGuard = new HallucinationGuard();
