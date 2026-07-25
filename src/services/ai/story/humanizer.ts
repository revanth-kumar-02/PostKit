import type { GeneratedPost, StoryPlan, AIRequestPayload } from '@/types/ai';
import type { IAIProvider } from '../provider.interface';
import { qualityCritic } from './qualityCritic';
import { rewriteEngine } from './rewriteEngine';
import { logger } from '@/lib/logger';

export class Humanizer {
  public async humanize(
    post: GeneratedPost,
    payload: AIRequestPayload,
    plan: StoryPlan,
    provider: IAIProvider,
    signal?: AbortSignal
  ): Promise<GeneratedPost> {
    const report = qualityCritic.evaluate(post, plan);
    logger.info(`Quality Critic Initial Score: ${report.overallScore}/10 (Passed: ${report.passed})`);

    if (report.passed) {
      return post;
    }

    logger.warn('Quality Critic score < 8.5 or issues detected. Triggering Humanizer Rewrite Engine.', report.critiqueFeedback);

    const { systemPrompt, userPrompt } = rewriteEngine.buildHumanizePrompt(
      payload,
      plan,
      report,
      post.hook
    );

    try {
      const response = await provider.generate(payload, {
        systemPrompt,
        userPrompt,
        signal,
      });

      if (response.success && response.post) {
        response.post.hook = post.hook; // Preserve verified hook
        const reReport = qualityCritic.evaluate(response.post, plan);
        logger.info(`Humanizer Rewrite Score: ${reReport.overallScore}/10`);
        return response.post;
      }
    } catch (err) {
      logger.error('Error during Humanizer rewrite execution:', err);
    }

    return post;
  }
}

export const humanizer = new Humanizer();
