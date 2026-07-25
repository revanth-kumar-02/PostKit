import type { AIRequestPayload, StoryPlan, CriticEvaluationReport } from '@/types/ai';

export class RewriteEngine {
  public buildHumanizePrompt(
    payload: AIRequestPayload,
    plan: StoryPlan,
    critique: CriticEvaluationReport,
    currentHook: string
  ): { systemPrompt: string; userPrompt: string } {
    const feedbackList = critique.critiqueFeedback.map((f) => `- ${f}`).join('\n');
    const knownFacts = plan.knownFacts.length > 0 ? plan.knownFacts.join(', ') : 'User input only';

    const systemPrompt = `You are an expert humanizer and software developer editor.
Your job is to rewrite a draft LinkedIn post to make it 100% human, honest, direct, and free of AI tropes.

CRITICAL HUMANIZATION RULES:
1. OPTIMIZE FOR AUTHENTICITY, NOT LENGTH: If the user's idea is simple, keep the post concise and direct. Never invent fake drama, artificial motivation, or fake lessons.
2. REMOVE ALL FILLER & BUZZWORDS: Eliminate phrases like "I wanted to", "I realized", "This project taught me", "I'm excited", "As a developer".
3. TRUTHFULNESS: Use ONLY facts explicitly provided in user idea: "${payload.idea.trim()}" (Confirmed facts: ${knownFacts}). Do NOT invent tech stacks, frameworks, stats, or timeline details.
4. RETURN RAW JSON ONLY matching:
   {
     "hook": "Exact opening hook provided in prompt.",
     "body": "Honest, direct body narrative paragraphs separated by \\n\\n.",
     "reflection": "Short, grounded, earned reflection sentence (or empty string if brief).",
     "cta": "Conversational closing question.",
     "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4"]
   }`;

    const userPrompt = `ORIGINAL USER IDEA:
"${payload.idea.trim()}"

OPENING HOOK (MUST BE USED EXACTLY IN THE "hook" FIELD):
"${currentHook}"

CRITIC EVALUATION FEEDBACK TO FIX:
${feedbackList}

REWRITE INSTRUCTIONS:
- Fix all issues flagged in the critique feedback.
- Keep the writing developer-first, concise, and authentic.
- Return RAW JSON ONLY.`;

    return { systemPrompt, userPrompt };
  }
}

export const rewriteEngine = new RewriteEngine();
