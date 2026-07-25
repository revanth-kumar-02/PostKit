import type { StoryPlan } from '../models/storyPlan.js';

export class StoryPlanner {
  public plan(topic: string, postType = 'Project Showcase'): StoryPlan {
    const text = topic.trim();
    const verifiedFacts: string[] = [text];
    const unknownFacts: string[] = [
      'Specific technologies unless stated',
      'Performance metrics & statistics',
      'Employer / Company details',
      'Timeline duration',
    ];

    const reflectionTheme = 'Turning conceptual ideas into functional software';
    const ctaTheme = 'Ask community about side project challenges';

    return {
      storyType: postType,
      coreIdea: text.slice(0, 60),
      mainSubject: 'Build project',
      verifiedFacts,
      unknownFacts,
      storyArc: {
        opening: 'Starting a practical build or project',
        middle: `Building "${text}"`,
        ending: 'Current evolution and key observation',
      },
      reflectionTheme,
      ctaTheme,
      hookDirection: 'Curiosity',
      knownFacts: verifiedFacts,
      forbiddenFacts: [
        'Do NOT invent company names or unstated employers.',
        'Do NOT invent programming languages, libraries, or databases.',
        'Do NOT invent metrics like 50% speedups or user counts.',
      ],
    };
  }
}

export const storyPlanner = new StoryPlanner();
