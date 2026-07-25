import { groqService } from './groqService.js';
import type { StoryPlan } from '../models/storyPlan.js';
import { logger } from '../utils/logger.js';

export interface HookCandidate {
  strategy: string;
  hook: string;
  score: number;
}

export class HookGenerator {
  private static readonly BANNED_PREFIXES = [
    'i built',
    'i created',
    'i spent',
    "i'm excited",
    "i'm thrilled",
    'as a developer',
    'today i',
  ];

  public async generateBestHook(topic: string, plan: StoryPlan): Promise<string> {
    const systemPrompt = `You are a world-class LinkedIn hook copywriter.
Generate 4 candidate opening hook sentences based on the user topic.

CRITICAL RULES:
1. Return ONLY raw JSON array of objects:
[
  { "strategy": "Curiosity", "hook": "Single short sentence under 18 words." },
  { "strategy": "Expectation vs Reality", "hook": "Single short sentence under 18 words." },
  { "strategy": "Reflection", "hook": "Single short sentence under 18 words." },
  { "strategy": "Challenge", "hook": "Single short sentence under 18 words." }
]
2. UNDER 18 WORDS per hook.
3. NEVER start with: "I built...", "I created...", "I spent...", "I'm excited...", "As a developer...", "Today I...".
4. Do NOT invent unmentioned technologies or stats.`;

    const userPrompt = `TOPIC: "${topic.trim()}"`;

    try {
      const responseText = await groqService.generate({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        jsonOutput: true,
        maxTokens: 400,
      });

      const candidates = this.parseCandidates(responseText);
      logger.info(`Generated ${candidates.length} raw hook candidates on backend.`);

      const scored = candidates.map((c) => ({
        ...c,
        score: this.scoreHook(c.hook, plan),
      }));

      scored.sort((a, b) => b.score - a.score);

      if (scored[0] && scored[0].score >= 7.0) {
        logger.info(`Winning backend hook (Strategy: ${scored[0].strategy}, Score: ${scored[0].score}/10): "${scored[0].hook}"`);
        return scored[0].hook;
      }
    } catch (err) {
      logger.error({ err }, 'Backend hook candidate generation error');
    }

    return `Building ${topic.slice(0, 35)} taught me something documentation never mentions.`;
  }

  private parseCandidates(jsonText: string): Array<{ strategy: string; hook: string }> {
    try {
      let cleaned = jsonText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      }
      const parsed = JSON.parse(cleaned);
      const list = Array.isArray(parsed) ? parsed : parsed.hooks || [];
      return list.filter((item: { hook?: string }) => typeof item.hook === 'string' && item.hook.trim().length > 0);
    } catch {
      return [];
    }
  }

  private scoreHook(hookText: string, _plan: StoryPlan): number {
    const text = hookText.trim().replace(/^["']|["']$/g, '');
    const lower = text.toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);

    if (words.length > 18) return 0;

    for (const prefix of HookGenerator.BANNED_PREFIXES) {
      if (lower.startsWith(prefix)) return 0;
    }

    let score = 5.0;
    if (words.length >= 6 && words.length <= 14) score += 2.5;
    if (lower.includes('thought') || lower.includes('realized') || lower.includes('underestimated') || lower.includes('bug')) score += 2.5;

    return Math.min(score, 10.0);
  }
}

export const hookGenerator = new HookGenerator();
