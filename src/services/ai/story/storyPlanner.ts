import type { ExtractedContext, StoryPlan } from '@/types/ai';

export class StoryPlanner {
  public plan(context: ExtractedContext): StoryPlan {
    const knownFacts: string[] = [];
    const forbiddenFacts: string[] = [];

    if (context.activity !== 'UNKNOWN') {
      knownFacts.push(`User activity: "${context.activity}"`);
    }

    if (context.project !== 'UNKNOWN') {
      knownFacts.push(`Project name: "${context.project}"`);
    } else {
      forbiddenFacts.push('Do NOT invent a company, employer, or project name if unprovided.');
    }

    if (context.technologies !== 'UNKNOWN') {
      knownFacts.push(`Technologies explicitly mentioned: ${context.technologies}`);
    } else {
      forbiddenFacts.push('Do NOT mention any specific programming languages, libraries, frameworks, or databases (e.g., React, Python, TypeScript, Node) unless explicitly in user text.');
    }

    if (context.achievements !== 'UNKNOWN') {
      knownFacts.push(`Achievement: "${context.achievements}"`);
    } else {
      forbiddenFacts.push('Do NOT invent user statistics, performance gains (e.g. 50% faster), user count, or fake metrics.');
    }

    if (context.challenges !== 'UNKNOWN') {
      knownFacts.push(`Challenge: "${context.challenges}"`);
    } else {
      forbiddenFacts.push('Do NOT invent complex dramatic bugs, technical obstacles, or fake crises.');
    }

    if (context.learning !== 'UNKNOWN') {
      knownFacts.push(`Stated learning: "${context.learning}"`);
    }

    // Default universal forbidden facts
    forbiddenFacts.push('Do NOT invent fake career goals, fake time spent (e.g. 3 months of hard work), or unmentioned employers.');
    forbiddenFacts.push('Do NOT invent GitHub links or deployment URLs.');

    return {
      hookStrategy: 'Opening line derived directly from the real user experience without dramatic hyperbole.',
      storyFlow: 'Hook -> Brief Context -> Real Experience -> Growth & Takeaway -> Conversational CTA',
      reflectionAngle: 'Authentic developer reflection on real progress and practical learnings.',
      ctaStyle: 'Conversational, peer-to-peer invitation to connect or discuss.',
      knownFacts,
      forbiddenFacts,
    };
  }
}

export const storyPlanner = new StoryPlanner();
