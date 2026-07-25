import type { AIRequestPayload, StoryPlan } from '@/types/ai';
import { hallucinationGuard } from './hallucinationGuard';

export class StoryPromptBuilder {
  public buildSystemPrompt(plan: StoryPlan): string {
    const factGuardRules = hallucinationGuard.generateGuardInstructions(plan);

    return `You are a real software developer and authentic technical writer sharing your genuine work experience on LinkedIn.

STORY INTELLIGENCE & FACTUALITY RULES:
1. TRUTHFULNESS & NO FABRICATION:
${factGuardRules}

2. COMPLETELY BANNED AI PHRASES (DO NOT USE ANY OF THESE):
   - "As a developer..." / "As a software engineer..."
   - "I'm excited to share..." / "I'm thrilled..."
   - "In today's fast-paced world..." / "In today's digital landscape..."
   - "Leveraging...", "Game-changing...", "Cutting-edge..."
   - "Simplify my workflow...", "Best practices...", "Unlock your potential..."
   - "This journey taught me...", "Delve into...", "Tapestry", "Testament", "Synergy"

3. HUMAN WRITING STYLE:
   - Write naturally like a real builder documenting real work in public.
   - Use simple, direct, conversational language.
   - Paragraphs must be short (1-3 sentences) with clear line breaks.
   - Never sound like marketing, corporate PR, or an automated blog summary.

4. REQUIRED OUTPUT FORMAT:
   Return ONLY a valid JSON object matching this exact structure:
   {
     "hook": "Attention-grabbing opening sentence rooted in real experience.",
     "body": "Natural narrative paragraphs separated by \\n\\n explaining context and what happened.",
     "reflection": "Short authentic reflection on what was learned or discovered.",
     "cta": "Conversational closing sentence or peer question.",
     "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4"]
   }
   DO NOT include markdown code blocks like \`\`\`json. Return raw JSON only.`;
  }

  public buildUserPrompt(payload: AIRequestPayload, plan: StoryPlan, isRetry = false): string {
    const postTypeInstructions = this.getPostTypeInstructions(payload.postType);
    const toneInstructions = this.getToneInstructions(payload.tone);
    const audienceInstructions = this.getAudienceInstructions(payload.audience);
    const lengthInstructions = this.getLengthInstructions(payload.length);

    let promptText = `USER RAW INPUT:
"${payload.idea.trim()}"

NARRATIVE PLAN:
- Hook Strategy: ${plan.hookStrategy}
- Story Flow: ${plan.storyFlow}
- Reflection Angle: ${plan.reflectionAngle}
- CTA Style: ${plan.ctaStyle}

STYLING & FORMATTING CONSTRAINTS:
- Post Type: ${payload.postType} -> ${postTypeInstructions}
- Tone: ${payload.tone} -> ${toneInstructions}
- Target Audience: ${payload.audience} -> ${audienceInstructions}
- Length Target: ${payload.length} -> ${lengthInstructions}`;

    if (isRetry) {
      promptText += `\n\nCRITICAL RETRY NOTICE: The previous output contained banned corporate phrases or hallucinated unmentioned facts. Write extremely conservatively using ONLY the provided input. Do NOT add fictional details. Return raw JSON ONLY.`;
    }

    return promptText;
  }

  private getPostTypeInstructions(postType: string): string {
    switch (postType) {
      case 'learning_journey':
        return 'Document a practical learning moment or obstacle faced, emphasizing true growth.';
      case 'project_showcase':
        return 'Describe what was built, why it was built, and direct practical observations.';
      case 'achievement':
        return 'Share a milestone with humble, grounded reflection without hype.';
      case 'career_update':
        return 'Share an authentic milestone or directional change with honest reflection.';
      case 'tutorial':
        return 'Break down how to solve a specific problem step-by-step clearly.';
      case 'opinion':
        return 'Express a thoughtful, grounded developer perspective on a tool or practice.';
      case 'personal_story':
        return 'Tell a candid, relatable story about a real-world builder experience.';
      default:
        return 'Share a truthful narrative based strictly on user input.';
    }
  }

  private getToneInstructions(tone: string): string {
    switch (tone) {
      case 'storytelling':
        return 'Narrative-driven, vivid, immersive, focusing on the real journey and key takeaway.';
      case 'professional':
        return 'Clear, articulate, respectful, polished, and free of fluff.';
      case 'friendly':
        return 'Warm, encouraging, conversational, and approachable.';
      case 'inspirational':
        return 'Uplifting and grounded, focusing on growth and determination.';
      case 'technical':
        return 'Engineering-focused, pragmatic, precise, and direct.';
      case 'casual':
        return 'Laid-back, candid, informal, and conversational.';
      default:
        return 'Authentic, concise, and direct.';
    }
  }

  private getAudienceInstructions(audience: string): string {
    switch (audience) {
      case 'developers':
        return 'Use software engineering context and developer phrasing naturally.';
      case 'recruiters':
        return 'Highlight problem-solving capability, ownership, and learning mindset.';
      case 'students':
        return 'Keep explanations clear, encouraging, and beginner-friendly.';
      case 'founders':
        return 'Focus on execution, building momentum, and practical learnings.';
      case 'general':
        return 'Keep phrasing accessible and easy to understand.';
      default:
        return 'Tailor phrasing to professionals.';
    }
  }

  private getLengthInstructions(length: string): string {
    switch (length) {
      case 'short':
        return 'Concise (Hook + 1 short body paragraph + reflection + CTA + hashtags, ~60-120 words total).';
      case 'medium':
        return 'Balanced (Hook + 2-3 body paragraphs + reflection + CTA + hashtags, ~150-250 words total).';
      case 'long':
        return 'Detailed (Hook + 3-4 body paragraphs + reflection + CTA + hashtags, ~280-400 words total).';
      default:
        return 'Balanced length (~150-250 words).';
    }
  }
}

export const storyPromptBuilder = new StoryPromptBuilder();
