export interface GeneratedPost {
  hook: string;
  body: string;
  reflection?: string;
  cta: string;
  hashtags: string[];
}

export interface CriticReport {
  overallScore: number;
  passed: boolean;
  critiqueFeedback: string[];
}

export class QualityCritic {
  public evaluate(post: GeneratedPost): CriticReport {
    const critiqueFeedback: string[] = [];
    const fullText = `${post.hook} ${post.body} ${post.reflection || ''} ${post.cta}`;
    const words = post.hook.trim().split(/\s+/);

    if (words.length > 18) {
      critiqueFeedback.push('Hook exceeds max length of 18 words.');
    }

    const lowerHook = post.hook.toLowerCase();
    if (
      lowerHook.startsWith('i built') ||
      lowerHook.startsWith('i created') ||
      lowerHook.startsWith('i spent') ||
      lowerHook.startsWith("i'm excited")
    ) {
      critiqueFeedback.push('Hook uses a generic cliché opening.');
    }

    if (fullText.toLowerCase().includes('as a developer') || fullText.toLowerCase().includes('fast-paced world')) {
      critiqueFeedback.push('Contains banned corporate AI phrases.');
    }

    let score = 9.5;
    if (critiqueFeedback.length > 0) {
      score -= critiqueFeedback.length * 2.0;
    }

    const overallScore = Math.max(Math.round(score * 10) / 10, 1.0);
    const passed = overallScore >= 8.5 && critiqueFeedback.length === 0;

    return {
      overallScore,
      passed,
      critiqueFeedback,
    };
  }
}

export const qualityCritic = new QualityCritic();
