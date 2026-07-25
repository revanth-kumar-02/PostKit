import type { ExtractedContext } from '@/types/ai';

export class ContextExtractor {
  public extract(ideaInput: string): ExtractedContext {
    const text = ideaInput.trim();
    const lower = text.toLowerCase();

    const techMatch = this.findTechnologies(lower, text);
    const activityMatch = this.findActivity(lower, text);
    const challengeMatch = this.findChallenges(lower, text);
    const learningMatch = this.findLearning(lower, text);
    const projectMatch = this.findProject(text);
    const achievementMatch = this.findAchievement(lower, text);

    return {
      project: projectMatch || 'UNKNOWN',
      activity: activityMatch || text,
      achievements: achievementMatch || 'UNKNOWN',
      challenges: challengeMatch || 'UNKNOWN',
      learning: learningMatch || 'UNKNOWN',
      technologies: techMatch || 'UNKNOWN',
      emotions: 'UNKNOWN',
      goal: 'Share authentic progress',
    };
  }

  private findTechnologies(_lower: string, text: string): string | null {
    const knownTechs = [
      'react', 'typescript', 'javascript', 'next.js', 'vite', 'tailwind', 'css', 'html',
      'node', 'express', 'python', 'django', 'fastapi', 'java', 'spring', 'go', 'rust',
      'docker', 'kubernetes', 'aws', 'gcp', 'firebase', 'postgress', 'mongodb', 'groq',
      'chrome extension', 'webextension'
    ];

    const found: string[] = [];
    knownTechs.forEach((tech) => {
      const regex = new RegExp(`\\b${tech}\\b`, 'i');
      if (regex.test(text)) {
        found.push(tech);
      }
    });

    return found.length > 0 ? found.join(', ') : null;
  }

  private findActivity(lower: string, text: string): string | null {
    if (lower.includes('built') || lower.includes('created') || lower.includes('developed')) {
      return text;
    }
    if (lower.includes('learned') || lower.includes('studied') || lower.includes('mastered')) {
      return text;
    }
    if (lower.includes('fixed') || lower.includes('solved') || lower.includes('debugged')) {
      return text;
    }
    return text;
  }

  private findChallenges(lower: string, text: string): string | null {
    if (lower.includes('bug') || lower.includes('issue') || lower.includes('stuck') || lower.includes('problem') || lower.includes('difficult') || lower.includes('hard')) {
      return text;
    }
    return null;
  }

  private findLearning(lower: string, text: string): string | null {
    if (lower.includes('learned') || lower.includes('discovered') || lower.includes('realized') || lower.includes('found out')) {
      return text;
    }
    return null;
  }

  private findProject(text: string): string | null {
    const words = text.split(/\s+/);
    // Find capitalized project names or words following "built", "project", "app", "extension"
    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[^a-zA-Z0-9]/g, '');
      if (word && word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase() && word.length > 2) {
        if (!['Built', 'Learned', 'Created', 'Fixed', 'Today', 'Yesterday', 'Phase', 'Day'].includes(word)) {
          return word;
        }
      }
    }
    return null;
  }

  private findAchievement(lower: string, text: string): string | null {
    if (lower.includes('completed') || lower.includes('finished') || lower.includes('launched') || lower.includes('passed') || lower.includes('achieved')) {
      return text;
    }
    return null;
  }
}

export const contextExtractor = new ContextExtractor();
