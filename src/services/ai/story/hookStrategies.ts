export interface HookStrategy {
  id: string;
  name: string;
  description: string;
  promptGuidance: string;
  example: string;
}

export const HOOK_STRATEGIES: Record<string, HookStrategy> = {
  curiosity: {
    id: 'curiosity',
    name: 'Curiosity',
    description: 'Creates intrigue or raises an open question.',
    promptGuidance: 'Write an opening sentence that makes the reader wonder what happened next.',
    example: 'I thought building a browser extension would be simple.',
  },
  expectation_vs_reality: {
    id: 'expectation_vs_reality',
    name: 'Expectation vs Reality',
    description: 'Highlights a contrast between expectation and reality.',
    promptGuidance: 'Contrast initial expectations with the actual reality encountered.',
    example: 'I underestimated how difficult browser automation really is.',
  },
  reflection: {
    id: 'reflection',
    name: 'Reflection',
    description: 'Shares a quiet, practical realization.',
    promptGuidance: 'Focus on a quiet realization or insight gained from real work.',
    example: 'The smallest side projects often teach the biggest lessons.',
  },
  challenge: {
    id: 'challenge',
    name: 'Challenge',
    description: 'Focuses on a real hurdle or obstacle.',
    promptGuidance: 'Lead with the specific problem or obstacle faced.',
    example: 'One bug kept me stuck for hours.',
  },
  honest: {
    id: 'honest',
    name: 'Honest',
    description: 'Unfiltered, direct, and transparent opening.',
    promptGuidance: 'Be direct, honest, and transparent about the experience.',
    example: "This wasn't the project I planned to build today.",
  },
  build_in_public: {
    id: 'build_in_public',
    name: 'Build in Public',
    description: 'Milestone observation from shipping or building in public.',
    promptGuidance: 'Frame the opening as an authentic build-in-public update.',
    example: 'Another late-night idea officially became a working build.',
  },
  lesson: {
    id: 'lesson',
    name: 'Lesson',
    description: 'Focuses on a practical real-world takeaway.',
    promptGuidance: 'Focus on a practical lesson that tutorials never mention.',
    example: 'I learned something today that documentation never taught me.',
  },
  technical: {
    id: 'technical',
    name: 'Technical',
    description: 'Engineering-focused entry point.',
    promptGuidance: 'Focus on an engineering detail or architectural nuance.',
    example: 'Browser extensions look simple until you start working with content scripts.',
  },
};

export class HookStrategySelector {
  public selectStrategies(postType: string, tone: string): HookStrategy[] {
    const list: HookStrategy[] = [];

    if (tone === 'technical' || postType === 'tutorial') {
      list.push(HOOK_STRATEGIES.technical, HOOK_STRATEGIES.expectation_vs_reality, HOOK_STRATEGIES.challenge);
    } else if (tone === 'storytelling' || postType === 'personal_story') {
      list.push(HOOK_STRATEGIES.curiosity, HOOK_STRATEGIES.expectation_vs_reality, HOOK_STRATEGIES.honest);
    } else if (postType === 'project_showcase') {
      list.push(HOOK_STRATEGIES.build_in_public, HOOK_STRATEGIES.expectation_vs_reality, HOOK_STRATEGIES.curiosity);
    } else if (postType === 'learning_journey') {
      list.push(HOOK_STRATEGIES.lesson, HOOK_STRATEGIES.reflection, HOOK_STRATEGIES.challenge);
    } else {
      list.push(HOOK_STRATEGIES.curiosity, HOOK_STRATEGIES.reflection, HOOK_STRATEGIES.honest);
    }

    return list;
  }
}

export const hookStrategySelector = new HookStrategySelector();
