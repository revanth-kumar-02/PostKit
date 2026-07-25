import type { FastifyReply, FastifyRequest } from 'fastify';
import type { GenerateRequestPayload } from '../schemas/generateSchema.js';
import { storyPlanner } from '../services/storyPlanner.js';
import { hookGenerator } from '../services/hookGenerator.js';
import { promptBuilder } from '../services/promptBuilder.js';
import { groqService } from '../services/groqService.js';
import { humanizer } from '../services/humanizer.js';
import type { GeneratedPost } from '../services/qualityCritic.js';
import { logger } from '../utils/logger.js';

export async function handleGeneratePost(
  request: FastifyRequest<{ Body: GenerateRequestPayload }>,
  reply: FastifyReply
) {
  const startTime = Date.now();
  const { topic, tone, audience, length } = request.body;

  logger.info({ reqId: request.id, topic: topic.slice(0, 40) }, 'Processing post generation request...');

  // 1. Story Planning
  const storyPlan = storyPlanner.plan(topic);

  // 2. Hook Generation (Generated FIRST)
  const verifiedHook = await hookGenerator.generateBestHook(topic, storyPlan);

  // 3. Prompt Building
  const { systemPrompt, userPrompt } = promptBuilder.buildPrompts(
    topic,
    storyPlan,
    verifiedHook,
    tone,
    audience,
    length
  );

  // 4. Groq Body Generation
  const rawContent = await groqService.generate({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    jsonOutput: true,
  });

  const parsedPost = JSON.parse(
    rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  ) as GeneratedPost;
  parsedPost.hook = verifiedHook;

  // 5. Quality Critic & Humanizer Evaluation
  const { post: finalPost, finalScore } = await humanizer.humanize(
    parsedPost,
    topic,
    storyPlan,
    verifiedHook
  );

  const durationMs = Date.now() - startTime;
  logger.info({ reqId: request.id, durationMs, qualityScore: finalScore }, 'Post generation complete.');

  return reply.status(200).send({
    success: true,
    storyPlan,
    post: finalPost,
    hashtags: finalPost.hashtags || [],
    qualityScore: finalScore,
    metadata: {
      model: 'llama-3.3-70b-versatile',
      generationTimeMs: durationMs,
    },
  });
}
