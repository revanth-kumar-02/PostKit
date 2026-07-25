import { groqService } from './groqService.js';
import { qualityCritic, type GeneratedPost } from './qualityCritic.js';
import type { StoryPlan } from '../models/storyPlan.js';
import { logger } from '../utils/logger.js';

export class Humanizer {
  public async humanize(
    post: GeneratedPost,
    topic: string,
    plan: StoryPlan,
    verifiedHook: string
  ): Promise<{ post: GeneratedPost; finalScore: number }> {
    const report = qualityCritic.evaluate(post);
    logger.info(`Backend Critic initial score: ${report.overallScore}/10`);

    if (report.passed) {
      return { post, finalScore: report.overallScore };
    }

    logger.warn({ feedback: report.critiqueFeedback }, 'Backend Critic score < 8.5. Triggering Humanizer Rewrite Engine.');

    const systemPrompt = `You are an expert humanizer editor. Rewrite the draft post to fix critique issues.
RULES:
1. Preserve exact opening hook: "${verifiedHook}".
2. Remove generic filler phrases and marketing PR.
3. Use ONLY facts explicitly provided in topic: "${topic}".
4. Return raw JSON ONLY matching: { "hook": "...", "body": "...", "reflection": "...", "cta": "...", "hashtags": [...] }`;

    const userPrompt = `TOPIC: "${topic}"
CRITIQUE ISSUES TO FIX:
${report.critiqueFeedback.map((f) => `- ${f}`).join('\n')}`;

    try {
      const responseText = await groqService.generate({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        jsonOutput: true,
      });

      const parsed = JSON.parse(responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()) as GeneratedPost;
      parsed.hook = verifiedHook;

      const finalReport = qualityCritic.evaluate(parsed);
      logger.info(`Humanizer rewrite final score: ${finalReport.overallScore}/10`);
      return { post: parsed, finalScore: finalReport.overallScore };
    } catch (err) {
      logger.error({ err }, 'Humanizer rewrite failed, falling back to initial post');
      return { post, finalScore: report.overallScore };
    }
  }
}

export const humanizer = new Humanizer();
