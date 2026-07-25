import type { ExtractedContext, FactClassification } from '@/types/ai';

export class FactClassifier {
  public classify(context: ExtractedContext, rawIdea: string): FactClassification {
    const verifiedFacts: string[] = [];
    const unknownFacts: string[] = [];
    const observableFacts: string[] = [];
    const hiddenFacts: string[] = [];

    if (context.activity !== 'UNKNOWN') {
      verifiedFacts.push(context.activity);
      observableFacts.push(`User activity: "${context.activity}"`);
    }

    if (context.project !== 'UNKNOWN') {
      verifiedFacts.push(`Project name is ${context.project}`);
      observableFacts.push(`Project: ${context.project}`);
    } else {
      unknownFacts.push('Project name');
    }

    if (context.technologies !== 'UNKNOWN') {
      verifiedFacts.push(`Technologies: ${context.technologies}`);
      observableFacts.push(`Tech stack: ${context.technologies}`);
    } else {
      unknownFacts.push('Technologies');
    }

    if (context.achievements !== 'UNKNOWN') {
      verifiedFacts.push(`Achievement: ${context.achievements}`);
    } else {
      unknownFacts.push('Achievements');
    }

    if (context.challenges !== 'UNKNOWN') {
      verifiedFacts.push(`Challenge: ${context.challenges}`);
    } else {
      unknownFacts.push('Challenges');
    }

    if (context.learning !== 'UNKNOWN') {
      verifiedFacts.push(`Stated learning: ${context.learning}`);
    } else {
      unknownFacts.push('Stated Learning');
    }

    if (context.emotions !== 'UNKNOWN') {
      verifiedFacts.push(`Stated emotion: ${context.emotions}`);
      hiddenFacts.push(`Stated emotion: ${context.emotions}`);
    } else {
      unknownFacts.push('Internal Emotions / Motivations');
      hiddenFacts.push('UNKNOWN (Do not fabricate feelings)');
    }

    // Include raw text as baseline verified fact if brief
    if (verifiedFacts.length === 0) {
      verifiedFacts.push(rawIdea.trim());
    }

    return {
      verifiedFacts,
      unknownFacts,
      observableFacts,
      hiddenFacts,
    };
  }
}

export const factClassifier = new FactClassifier();
