import type { AIRequestPayload, ExtractedContext, StoryPlan, HookEvaluationResult } from '@/types/ai';
import { hookStrategySelector } from './hookStrategies';
import { hookEvaluator } from './hookEvaluator';
import { envConfig } from '@/config/env.config';
import { httpClient } from '@/lib/fetch';
import { logger } from '@/lib/logger';

interface GroqHooksResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class HookGenerator {
  private readonly baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly model = 'llama-3.3-70b-versatile';

  public async generateBestHook(
    payload: AIRequestPayload,
    context: ExtractedContext,
    plan: StoryPlan,
    signal?: AbortSignal
  ): Promise<string> {
    const strategies = hookStrategySelector.selectStrategies(payload.postType, payload.tone);
    const strategyPrompts = strategies.map((s) => `- ${s.name}: ${s.promptGuidance}`).join('\n');

    const systemPrompt = `You are an expert LinkedIn hook copywriter.
Your ONLY task is to generate 4 candidate opening hook sentences for a LinkedIn post based on the user's idea.

CRITICAL HOOK RULES:
1. Return ONLY raw JSON matching: { "hooks": ["hook 1", "hook 2", "hook 3", "hook 4"] }
2. NO MARKDOWN: Do not wrap in \`\`\`json code blocks.
3. UNDER 18 WORDS: Every hook MUST be a single sentence under 18 words.
4. BANNED PREFIXES: NEVER start a hook with:
   - "I built..."
   - "I created..."
   - "I spent..."
   - "I'm excited..."
   - "I'm thrilled..."
   - "As a developer..."
   - "Today I..."
5. BANNED BUZZWORDS: Never use "fast-paced world", "leveraging", "game-changing", "cutting-edge".
6. NO FABRICATIONS: Only use facts from user idea: "${payload.idea.trim()}". Do not invent tech stacks or stats.`;

    const userPrompt = `USER IDEA: "${payload.idea.trim()}"
Post Type: ${payload.postType}
Tone: ${payload.tone}

TARGET HOOK STRATEGIES:
${strategyPrompts}

Generate 4 candidate opening hooks as a JSON object with a "hooks" array.`;

    try {
      logger.info('Generating candidate opening hooks via Groq...');

      const response = await httpClient<GroqHooksResponse>(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${envConfig.groqApiKey}`,
        },
        body: {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          max_tokens: 400,
          temperature: 0.7,
        },
        timeoutMs: 15000,
        signal,
      });

      const rawContent = response.choices?.[0]?.message?.content || '';
      const candidateTexts = this.parseHookCandidates(rawContent);

      logger.info(`Extracted ${candidateTexts.length} raw hook candidates.`);

      const evaluatedResults: HookEvaluationResult[] = candidateTexts.map((text) =>
        hookEvaluator.evaluate(text, plan)
      );

      evaluatedResults.sort((a, b) => b.score - a.score);

      const winner = evaluatedResults.find((r) => r.isValid);
      if (winner) {
        logger.info(`Selected winning hook (Score ${winner.score}/10): "${winner.hook}"`);
        return winner.hook;
      }

      // If no candidate scored >= 8.5, fallback to the top candidate if word count is ok
      const topScorer = evaluatedResults[0];
      if (topScorer && topScorer.hook.split(/\s+/).length <= 18 && topScorer.score > 0) {
        logger.warn(`Using fallback top-scoring hook (Score ${topScorer.score}/10): "${topScorer.hook}"`);
        return topScorer.hook;
      }
    } catch (err) {
      logger.error('Error during hook candidate generation:', err);
    }

    // Default safe fallback hook if API fails or all candidate checks fail
    return this.getSafeFallbackHook(payload, context);
  }

  private parseHookCandidates(rawJson: string): string[] {
    let cleaned = rawJson.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    try {
      const parsed = JSON.parse(cleaned) as { hooks?: string[] };
      if (Array.isArray(parsed.hooks)) {
        return parsed.hooks.filter((h) => typeof h === 'string' && h.trim().length > 0);
      }
    } catch {
      logger.warn('Failed to parse hook candidates JSON:', rawJson);
    }

    return [];
  }

  private getSafeFallbackHook(payload: AIRequestPayload, context: ExtractedContext): string {
    if (context.project !== 'UNKNOWN') {
      return `Building ${context.project} taught me something documentation never mentions.`;
    }
    if (payload.postType === 'learning_journey') {
      return 'The smallest side project often yields the biggest technical lessons.';
    }
    return 'Some of the most valuable developer insights come from unexpected build hurdles.';
  }
}

export const hookGenerator = new HookGenerator();
