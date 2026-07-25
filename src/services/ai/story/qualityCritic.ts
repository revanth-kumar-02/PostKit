import type { GeneratedPost, StoryPlan, CriticEvaluationReport, CategoryScore } from '@/types/ai';
import { fillerDetector } from './fillerDetector';
import { hallucinationGuard } from './hallucinationGuard';

export class QualityCritic {
  public evaluate(post: GeneratedPost, plan: StoryPlan): CriticEvaluationReport {
    const fullText = `${post.hook} ${post.body} ${post.reflection || ''} ${post.cta}`;
    const categoryScores: CategoryScore[] = [];
    const critiqueFeedback: string[] = [];

    // 1. Hook Strength Score
    const hookWords = post.hook.trim().split(/\s+/);
    let hookScore = 10.0;
    if (hookWords.length > 18) {
      hookScore -= 4.0;
      critiqueFeedback.push('Hook is too long (> 18 words).');
    }
    const lowerHook = post.hook.toLowerCase();
    if (
      lowerHook.startsWith('i built') ||
      lowerHook.startsWith('i created') ||
      lowerHook.startsWith('i spent') ||
      lowerHook.startsWith("i'm excited")
    ) {
      hookScore -= 4.0;
      critiqueFeedback.push('Hook uses a generic cliché opening statement.');
    }
    categoryScores.push({ category: 'Hook Strength', score: Math.max(hookScore, 1.0) });

    // 2. Authenticity Score
    let authScore = 10.0;
    if (fullText.toLowerCase().includes('marketing') || fullText.toLowerCase().includes('thrilled')) {
      authScore -= 3.0;
      critiqueFeedback.push('Tone sounds like corporate marketing PR.');
    }
    categoryScores.push({ category: 'Authenticity', score: Math.max(authScore, 1.0) });

    // 3. Hallucination Check Score
    let hallucinationScore = 10.0;
    const hasForbiddenTech = hallucinationGuard.checkHallucinatedTech(fullText, plan);
    if (hasForbiddenTech) {
      hallucinationScore -= 5.0;
      critiqueFeedback.push('Post invents tech stacks or tools not present in user input.');
    }
    categoryScores.push({ category: 'Hallucination Check', score: Math.max(hallucinationScore, 1.0) });

    // 4. Storytelling & Structure Score
    let storyScore = 10.0;
    if (!post.body || post.body.length < 30) {
      storyScore -= 4.0;
      critiqueFeedback.push('Body narrative lacks depth or structure.');
    }
    categoryScores.push({ category: 'Storytelling & Structure', score: Math.max(storyScore, 1.0) });

    // 5. Naturalness Score
    let naturalScore = 10.0;
    if (fullText.includes('As a developer') || fullText.includes('As a software engineer')) {
      naturalScore -= 3.5;
      critiqueFeedback.push('Uses artificial introductory persona phrase ("As a developer").');
    }
    categoryScores.push({ category: 'Naturalness', score: Math.max(naturalScore, 1.0) });

    // 6. LinkedIn Quality & Formatting Score
    let linkedinScore = 10.0;
    if (post.hashtags.length < 2 || post.hashtags.length > 8) {
      linkedinScore -= 2.0;
      critiqueFeedback.push('Hashtag count is inappropriate (should be 4 to 6).');
    }
    categoryScores.push({ category: 'LinkedIn Quality', score: Math.max(linkedinScore, 1.0) });

    // 7. Filler Detection Score
    let fillerScore = 10.0;
    const detectedFillers = fillerDetector.detect(fullText);
    if (detectedFillers.length > 0) {
      fillerScore -= Math.min(detectedFillers.length * 2.5, 6.0);
      critiqueFeedback.push(`Contains generic filler phrases: ${detectedFillers.map((f) => `"${f}"`).join(', ')}`);
    }
    categoryScores.push({ category: 'Filler Detection', score: Math.max(fillerScore, 1.0) });

    // Calculate Overall Average Score
    const totalScoreSum = categoryScores.reduce((sum, item) => sum + item.score, 0);
    const overallScore = Math.round((totalScoreSum / categoryScores.length) * 10) / 10;
    const passed = overallScore >= 8.5 && critiqueFeedback.length === 0;

    return {
      overallScore,
      passed,
      categoryScores,
      critiqueFeedback,
    };
  }
}

export const qualityCritic = new QualityCritic();
