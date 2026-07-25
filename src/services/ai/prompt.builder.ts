import type { AIRequestPayload } from '@/types/ai';

export class PromptBuilder {
  private static readonly SYSTEM_PROMPT = `You are an expert LinkedIn writing assistant and authentic technical storyteller.
Your task is to transform a raw user idea into a compelling, authentic, human-sounding LinkedIn post.

CRITICAL RULES:
1. Output MUST be ONLY valid JSON matching this exact structure:
   {
     "hook": "Single attention-grabbing first sentence.",
     "body": "Story body with natural paragraph breaks using \\n\\n.",
     "cta": "Conversational closing sentence or question.",
     "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4"]
   }
2. DO NOT wrap JSON in markdown code blocks like \`\`\`json. Output raw JSON only.
3. SOUND HUMAN: Write like a real developer or builder sharing an authentic experience in public.
4. BANNED WORDS & BUZZWORDS (NEVER USE ANY OF THESE):
   - "In today's fast-paced world..."
   - "As professionals..."
   - "Leveraging..."
   - "Game-changing..."
   - "Revolutionary..."
   - "Cutting-edge..."
   - "Unlock your potential..."
   - "I'm thrilled to announce..."
   - "Delve into..."
   - "Tapestry", "Testament", "Beacon", "Synergy", "Paradigm shift"
5. NO HALLUCINATIONS: Expand on the user's idea naturally, but NEVER invent fake companies, achievements, metrics, technologies, or job titles not in the user's prompt.
6. Provide 4 to 6 relevant, non-repetitive hashtags.`;

  public buildSystemPrompt(): string {
    return PromptBuilder.SYSTEM_PROMPT;
  }

  public buildUserPrompt(payload: AIRequestPayload): string {
    const postTypeModifier = this.getPostTypeInstructions(payload.postType);
    const toneModifier = this.getToneInstructions(payload.tone);
    const audienceModifier = this.getAudienceInstructions(payload.audience);
    const lengthModifier = this.getLengthInstructions(payload.length);

    return `Transform the following idea into a LinkedIn post:

USER IDEA:
"${payload.idea.trim()}"

STYLING & STRUCTURE CONSTRAINTS:
- Post Type: ${payload.postType} -> ${postTypeModifier}
- Tone: ${payload.tone} -> ${toneModifier}
- Target Audience: ${payload.audience} -> ${audienceModifier}
- Desired Length: ${payload.length} -> ${lengthModifier}

REMINDER: Return ONLY JSON. Do not include markdown code block formatting.`;
  }

  private getPostTypeInstructions(postType: string): string {
    switch (postType) {
      case 'learning_journey':
        return 'Focus on a personal learning milestone, a hurdle faced, and the key takeaway.';
      case 'project_showcase':
        return 'Focus on what was built, why it matters, technical choices, and practical lessons.';
      case 'achievement':
        return 'Focus on reaching a goal with humble reflection, hard work, and authentic appreciation.';
      case 'career_update':
        return 'Focus on a career shift or milestone with genuine reflection on past growth and future goals.';
      case 'tutorial':
        return 'Focus on explaining how to solve a specific problem step-by-step with practical value.';
      case 'opinion':
        return 'Provide a clear, thoughtful, and authentic developer perspective on a tool or workflow.';
      case 'personal_story':
        return 'Tell a relatable, honest story about a real-world builder experience.';
      default:
        return 'Share an authentic, structured story based on the experience.';
    }
  }

  private getToneInstructions(tone: string): string {
    switch (tone) {
      case 'storytelling':
        return 'Narrative-driven, vivid, immersive, focusing on the journey, tension, pivotal moment, and emotional discovery.';
      case 'professional':
        return 'Clear, polished, articulate, and respectful without corporate jargon.';
      case 'friendly':
        return 'Warm, encouraging, conversational, and approachable.';
      case 'inspirational':
        return 'Uplifting and motivating, emphasizing perseverance and growth mindset.';
      case 'technical':
        return 'Engineering-focused, precise, practical, and grounded in technical detail.';
      case 'casual':
        return 'Laid-back, candid, informal, and conversational.';
      default:
        return 'Authentic, clear, and direct.';
    }
  }

  private getAudienceInstructions(audience: string): string {
    switch (audience) {
      case 'developers':
        return 'Use software engineering context, build-in-public phrasing, and developer terms.';
      case 'recruiters':
        return 'Highlight problem-solving ability, ownership, collaboration, and learning agility.';
      case 'students':
        return 'Keep explanations encouraging, accessible, and beginner-friendly.';
      case 'founders':
        return 'Focus on shipping velocity, product execution, user feedback, and lessons learned.';
      case 'general':
        return 'Keep wording broadly accessible without overly niche jargon.';
      default:
        return 'Tailor phrasing naturally to a professional audience.';
    }
  }

  private getLengthInstructions(length: string): string {
    switch (length) {
      case 'short':
        return 'Concise (Hook + 1 concise body paragraph + CTA + hashtags, ~60-120 words total).';
      case 'medium':
        return 'Balanced (Hook + 2-3 body paragraphs + CTA + hashtags, ~150-250 words total).';
      case 'long':
        return 'In-depth narrative (Hook + 3-5 detailed body paragraphs + CTA + hashtags, ~300-450 words total).';
      default:
        return 'Balanced length (~150-250 words).';
    }
  }
}

export const promptBuilder = new PromptBuilder();
