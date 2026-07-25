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
    const systemPrompt = `You are PostKit AI hook generator.
Generate 4 candidate opening hook sentences based on the verified user input.

HOOK REQUIREMENTS:
1. Return ONLY raw JSON array of objects:
[
  { "strategy": "Curiosity", "hook": "Short sentence under 14 words." },
  { "strategy": "Expectation vs Reality", "hook": "Short sentence under 14 words." },
  { "strategy": "Reflection", "hook": "Short sentence under 14 words." },
  { "strategy": "Honest", "hook": "Short sentence under 14 words." }
]
2. UNDER 14 WORDS per hook.
3. NO CLICKBAIT, NO EMOJIS, NO QUOTES.
4. BANNED PREFIXES: NEVER start with "I built...", "I created...", "I spent...", "I'm excited...", "As a developer...", "Today I...".
5. NO FABRICATIONS: Only use facts from user input: "${topic.trim()}".`;

    const userPrompt = `VERIFIED USER INPUT: "${topic.trim()}"`;

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

    return `Building ${topic.slice(0, 30)} revealed unexpected insights.`;
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

    // Max 14 words rule
    if (words.length > 14) return 0;

    for (const prefix of HookGenerator.BANNED_PREFIXES) {
      if (lower.startsWith(prefix)) return 0;
    }

    let score = 6.0;
    if (words.length >= 5 && words.length <= 12) score += 2.0;
    if (!lower.includes('!')) score += 1.0;
    if (lower.includes('sometimes') || lower.includes('project') || lower.includes('experiment') || lower.includes('realized')) score += 1.0;

    return Math.min(score, 10.0);
  }
}

export const hookGenerator = new HookGenerator();
