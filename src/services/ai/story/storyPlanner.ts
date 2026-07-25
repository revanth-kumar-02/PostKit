import type {
  ExtractedContext,
  StoryPlan,
  AIRequestPayload,
  StoryType,
  HookDirection,
  StoryArc,
} from '@/types/ai';
import { factClassifier } from './factClassifier';
import { themeGenerator } from './themeGenerator';

export class StoryPlanner {
  public plan(context: ExtractedContext, payload?: AIRequestPayload): StoryPlan {
    const rawIdea = payload?.idea || context.activity;
    const postTypeInput = payload?.postType || 'project_showcase';
    const toneInput = payload?.tone || 'storytelling';

    // 1. Fact Classification
    const facts = factClassifier.classify(context, rawIdea);

    // 2. Safe Theme Generation
    const theme = themeGenerator.generateSafeTheme(context, postTypeInput);

    // 3. Classify Story Type
    const storyType = this.mapStoryType(postTypeInput);

    // 4. Select Hook Direction
    const hookDirection = this.determineHookDirection(toneInput, postTypeInput);

    // 5. Formulate Story Arc (Beginning, Middle, Ending)
    const storyArc = this.buildStoryArc(context, storyType, rawIdea);

    const mainSubject = context.project !== 'UNKNOWN' ? context.project : 'Current Build';
    const coreIdea = context.activity !== 'UNKNOWN' ? context.activity : rawIdea.slice(0, 50);

    // Downstream compatibility rules
    const knownFacts = facts.verifiedFacts;
    const forbiddenFacts: string[] = [];

    if (context.project === 'UNKNOWN') {
      forbiddenFacts.push('Do NOT invent a company, employer, or fake product name.');
    }
    if (context.technologies === 'UNKNOWN') {
      forbiddenFacts.push('Do NOT mention any unstated programming languages, frameworks, or libraries.');
    }
    if (context.achievements === 'UNKNOWN') {
      forbiddenFacts.push('Do NOT invent fake user metrics, percentage gains, or download stats.');
    }
    if (context.challenges === 'UNKNOWN') {
      forbiddenFacts.push('Do NOT invent fake crises or dramatic technical breakdowns.');
    }

    forbiddenFacts.push('Do NOT invent unmentioned timeline details, fake emotions, or fake career goals.');

    return {
      storyType,
      coreIdea,
      mainSubject,
      verifiedFacts: facts.verifiedFacts,
      unknownFacts: facts.unknownFacts,
      storyArc,
      reflectionTheme: theme.reflectionTheme,
      ctaTheme: theme.ctaTheme,
      hookDirection,

      // Downstream fields
      knownFacts,
      forbiddenFacts,
      hookStrategy: `Hook strategy: ${hookDirection}`,
      storyFlow: `${storyArc.opening} -> ${storyArc.middle} -> ${storyArc.ending}`,
      reflectionAngle: theme.reflectionTheme,
      ctaStyle: `Ask community about ${theme.ctaTheme}`,
    };
  }

  private mapStoryType(input: string): StoryType {
    switch (input) {
      case 'learning_journey':
        return 'Learning Journey';
      case 'project_showcase':
        return 'Project Showcase';
      case 'achievement':
        return 'Achievement';
      case 'tutorial':
        return 'Technical Insight';
      case 'opinion':
        return 'Opinion';
      case 'career_update':
        return 'Career Update';
      case 'personal_story':
        return 'Personal Story';
      default:
        return 'Project Showcase';
    }
  }

  private determineHookDirection(tone: string, postType: string): HookDirection {
    if (tone === 'technical' || postType === 'tutorial') return 'Technical';
    if (tone === 'storytelling' || postType === 'personal_story') return 'Curiosity';
    if (postType === 'learning_journey') return 'Growth';
    if (postType === 'achievement') return 'Reflection';
    if (postType === 'project_showcase') return 'Unexpected';
    return 'Curiosity';
  }

  private buildStoryArc(context: ExtractedContext, storyType: StoryType, rawIdea: string): StoryArc {
    const mainAction = context.activity !== 'UNKNOWN' ? context.activity : rawIdea;

    switch (storyType) {
      case 'Project Showcase':
        return {
          opening: 'Starting a practical build or project',
          middle: `Developing ${mainAction}`,
          ending: 'Active progress and next iterations',
        };
      case 'Learning Journey':
        return {
          opening: 'Encountering a new concept or hurdle',
          middle: 'Testing solutions through trial and error',
          ending: 'Practical takeaway and growth',
        };
      case 'Achievement':
        return {
          opening: 'Setting out on a milestone target',
          middle: 'Work put into execution',
          ending: 'Reaching the objective with humble appreciation',
        };
      default:
        return {
          opening: 'Initial context of the experience',
          middle: `Working through ${mainAction}`,
          ending: 'Reflective conclusion and next steps',
        };
    }
  }
}

export const storyPlanner = new StoryPlanner();
