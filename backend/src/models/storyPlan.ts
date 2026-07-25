export interface StoryArc {
  opening: string;
  middle: string;
  ending: string;
}

export interface StoryPlan {
  storyType: string;
  coreIdea: string;
  mainSubject: string;
  verifiedFacts: string[];
  unknownFacts: string[];
  storyArc: StoryArc;
  reflectionTheme: string;
  ctaTheme: string;
  hookDirection: string;
  knownFacts: string[];
  forbiddenFacts: string[];
}
