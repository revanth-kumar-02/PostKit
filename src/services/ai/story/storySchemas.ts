import type { StoryType, HookDirection } from './storyTypes';

export interface StoryArc {
  opening: string;
  middle: string;
  ending: string;
}

export interface FactClassification {
  verifiedFacts: string[];
  unknownFacts: string[];
  observableFacts: string[];
  hiddenFacts: string[];
}

export interface SafeTheme {
  reflectionTheme: string;
  ctaTheme: string;
}

export interface StoryPlan {
  storyType: StoryType;
  coreIdea: string;
  mainSubject: string;
  verifiedFacts: string[];
  unknownFacts: string[];
  storyArc: StoryArc;
  reflectionTheme: string;
  ctaTheme: string;
  hookDirection: HookDirection;
  
  // Downstream compatibility fields
  knownFacts: string[];
  forbiddenFacts: string[];
  hookStrategy: string;
  storyFlow: string;
  reflectionAngle: string;
  ctaStyle: string;
}
