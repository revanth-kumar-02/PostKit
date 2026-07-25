import type { StoryPlan } from '../models/storyPlan.js';

export class PromptBuilder {
  public buildPrompts(
    topic: string,
    plan: StoryPlan,
    verifiedHook: string,
    tone: string,
    audience: string,
    length: string,
    isRetry = false
  ): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `You are an authentic software engineer writing a real LinkedIn post about your project.

RULES:
1. TRUTHFULNESS: Use ONLY facts explicitly in topic input: "${topic}". Never invent unmentioned frameworks, tech stacks, stats, or employers.
2. BANNED PHRASES: Do NOT use "As a developer", "I'm excited", "fast-paced world", "leveraging", "game-changing", "cutting-edge".
3. NO FABRICATED LESSONS: Keep story honest and simple.
4. REQUIRED JSON OUTPUT FORMAT:
   {
     "hook": "Exact opening hook provided in prompt.",
     "body": "Natural body narrative paragraphs separated by \\n\\n.",
     "reflection": "Short, grounded reflection sentence.",
     "cta": "Conversational closing question.",
     "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4"]
   }
   Return raw JSON ONLY. No markdown wrappers.`;

    let userPrompt = `TOPIC: "${topic.trim()}"
OPENING HOOK (MUST BE USED EXACTLY AS THE "hook" VALUE):
"${verifiedHook}"

STYLING:
- Tone: ${tone}
- Audience: ${audience}
- Length: ${length}

INSTRUCTION: Place "${verifiedHook}" in the "hook" key. Write body, reflection, cta, and hashtags continuing seamlessly from that exact hook.`;

    if (isRetry) {
      userPrompt += `\n\nRETRY NOTICE: Write conservatively using ONLY user facts. Do NOT add fictional details. Return raw JSON ONLY.`;
    }

    return { systemPrompt, userPrompt };
  }
}

export const promptBuilder = new PromptBuilder();
