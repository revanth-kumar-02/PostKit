import type { GeneratedPost } from '@/types/ai';

export class QualityChecker {
  public checkQuality(post: GeneratedPost): string[] {
    const issues: string[] = [];

    if (!post.hook || post.hook.trim().length < 10) {
      issues.push('Opening hook is missing or too short.');
    }

    if (!post.body || post.body.trim().length < 30) {
      issues.push('Post body is missing or insufficient.');
    }

    if (!post.cta || post.cta.trim().length < 5) {
      issues.push('Call to action (CTA) is missing.');
    }

    // Check repeated sentences
    const allSentences = `${post.hook} ${post.body} ${post.cta}`
      .split(/[.!?]+/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 15);

    const sentenceSet = new Set<string>();
    for (const sentence of allSentences) {
      if (sentenceSet.has(sentence)) {
        issues.push(`Repeated sentence detected: "${sentence.slice(0, 30)}..."`);
        break;
      }
      sentenceSet.add(sentence);
    }

    // Check hashtag quantity
    if (post.hashtags.length < 2) {
      issues.push('Fewer than 2 hashtags generated.');
    } else if (post.hashtags.length > 8) {
      issues.push('Excessive hashtags generated (more than 8).');
    }

    return issues;
  }
}

export const qualityChecker = new QualityChecker();
