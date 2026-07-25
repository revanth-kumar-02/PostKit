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
