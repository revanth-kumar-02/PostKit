import type { ValidationResult } from '@/types/ai';

export const MIN_IDEA_LENGTH = 5;
export const MAX_IDEA_LENGTH = 1000;

export function validateIdeaInput(idea: string): ValidationResult {
  const trimmed = idea.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Post idea cannot be empty. Please enter your post idea.',
    };
  }

  if (trimmed.length < MIN_IDEA_LENGTH) {
    return {
      isValid: false,
      error: `Post idea is too short. Please describe your idea in at least ${MIN_IDEA_LENGTH} characters.`,
    };
  }

  if (trimmed.length > MAX_IDEA_LENGTH) {
    return {
      isValid: false,
      error: `Post idea is too long. Please keep your idea under ${MAX_IDEA_LENGTH} characters.`,
    };
  }

  return { isValid: true };
}
