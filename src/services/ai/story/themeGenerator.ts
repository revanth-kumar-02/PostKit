import type { ExtractedContext, SafeTheme } from '@/types/ai';

export class ThemeGenerator {
  public generateSafeTheme(context: ExtractedContext, postType: string): SafeTheme {
    const isProject = context.project !== 'UNKNOWN' || postType === 'project_showcase';
    const isLearning = context.learning !== 'UNKNOWN' || postType === 'learning_journey';
    const isChallenge = context.challenges !== 'UNKNOWN';

    let reflectionTheme = 'Watching ideas evolve through hands-on building';
    let ctaTheme = 'Side Projects';

    if (isProject) {
      reflectionTheme = 'Turning conceptual ideas into working software';
      ctaTheme = 'Building Side Projects';
    } else if (isChallenge) {
      reflectionTheme = 'Navigating unexpected build hurdles in public';
      ctaTheme = 'Overcoming Bugs';
    } else if (isLearning) {
      reflectionTheme = 'Practical insights gained from hands-on experimentation';
      ctaTheme = 'Continuous Learning';
    }

    return {
      reflectionTheme,
      ctaTheme,
    };
  }
}

export const themeGenerator = new ThemeGenerator();
