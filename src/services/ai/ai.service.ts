import type { IAIProvider } from './provider.interface';
import { GroqProvider } from './groq.provider';
import type { AIRequestPayload, AIResponsePayload } from '@/types/ai';
import { validateIdeaInput } from '@/utils/validator';
import { contextExtractor } from './story/contextExtractor';
import { storyPlanner } from './story/storyPlanner';
import { hookGenerator } from './story/hookGenerator';
import { storyPromptBuilder } from './story/promptBuilder';
import { humanizer } from './story/humanizer';
import { outputValidator } from './story/outputValidator';
import { logger } from '@/lib/logger';

export class AIService {
  private activeProvider: IAIProvider;
  private providers: Map<string, IAIProvider> = new Map();
  private activeAbortController: AbortController | null = null;

  constructor() {
    const groqProvider = new GroqProvider();
    this.providers.set(groqProvider.id, groqProvider);
    this.activeProvider = groqProvider;
  }

  public setProvider(providerId: string): boolean {
    const provider = this.providers.get(providerId);
    if (provider) {
      this.activeProvider = provider;
      logger.info(`AI Service active provider set to: ${provider.name}`);
      return true;
    }
    return false;
  }

  public getActiveProviderName(): string {
    return this.activeProvider.name;
  }

  public cancelCurrentRequest(): void {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
      logger.info('In-flight AI generation request cancelled.');
    }
  }

  public async generate(payload: AIRequestPayload): Promise<AIResponsePayload> {
    this.cancelCurrentRequest();

    const validation = validateIdeaInput(payload.idea);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || 'Invalid post idea input.',
      };
    }

    if (!this.activeProvider.isConfigured()) {
      return {
        success: false,
        error: `${this.activeProvider.name} is not properly configured. Please check your VITE_GROQ_API_KEY setting.`,
      };
    }

    this.activeAbortController = new AbortController();
    const signal = this.activeAbortController.signal;

    try {
      // Step 1: Context Extraction
      const context = contextExtractor.extract(payload.idea);
      logger.debug('Extracted Context:', context);

      // Step 2: Story Planning
      const plan = storyPlanner.plan(context);
      logger.debug('Story Plan:', plan);

      // Step 3: Dedicated Hook Generation Engine (Generated & Verified FIRST)
      const verifiedHook = await hookGenerator.generateBestHook(payload, context, plan, signal);
      logger.info(`Hook Engine selected opening hook: "${verifiedHook}"`);

      // Step 4: Story Body Prompt Construction (Anchored to verified hook)
      const systemPrompt = storyPromptBuilder.buildSystemPrompt(plan);
      const userPrompt = storyPromptBuilder.buildUserPromptWithHook(payload, plan, verifiedHook, false);

      // Step 5: Body Generation
      const response = await this.activeProvider.generate(payload, {
        systemPrompt,
        userPrompt,
        signal,
      });

      if (response.success && response.post) {
        // Enforce exact verified hook
        response.post.hook = verifiedHook;

        // Step 6: AI Quality Critic & Humanizer Engine
        const humanizedPost = await humanizer.humanize(
          response.post,
          payload,
          plan,
          this.activeProvider,
          signal
        );

        response.post = humanizedPost;

        // Step 7: Final Output Quality Check
        const finalReport = outputValidator.validate(response.post, plan);
        logger.info('Final post validation status:', finalReport.isValid);
      }

      this.activeAbortController = null;
      return response;
    } catch (err) {
      this.activeAbortController = null;
      logger.error('Unhandled exception in AIService:', err);
      return {
        success: false,
        error: 'An unexpected error occurred during post generation.',
      };
    }
  }
}

export const aiService = new AIService();
