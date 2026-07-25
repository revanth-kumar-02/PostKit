export interface AIRequestPayload {
  idea: string;
  postType: string;
  tone: string;
  audience: string;
  length: string;
}

export interface GeneratedPost {
  hook: string;
  body: string;
  reflection?: string;
  cta: string;
  hashtags: string[];
}

export interface AIResponsePayload {
  success: boolean;
  message?: string;
  error?: string;
  provider?: string;
  post?: GeneratedPost;
  rawText?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ExtractedContext {
  project: string;
  activity: string;
  achievements: string;
  challenges: string;
  learning: string;
  technologies: string;
  emotions: string;
  goal: string;
}

export interface StoryPlan {
  hookStrategy: string;
  storyFlow: string;
  reflectionAngle: string;
  ctaStyle: string;
  knownFacts: string[];
  forbiddenFacts: string[];
}

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  hasHallucinations: boolean;
  hasBannedWords: boolean;
}

export interface HookCandidate {
  text: string;
  strategy: string;
}

export interface HookEvaluationResult {
  hook: string;
  score: number;
  isValid: boolean;
  reasons: string[];
}

export interface CategoryScore {
  category: string;
  score: number;
  comment?: string;
}

export interface CriticEvaluationReport {
  overallScore: number;
  passed: boolean;
  categoryScores: CategoryScore[];
  critiqueFeedback: string[];
}
