export class FillerDetector {
  private static readonly FILLER_PHRASES = [
    'i wanted to',
    'i realized',
    'i learned a lot',
    'this project taught me',
    "i'm excited",
    'as a developer',
    'as a software engineer',
    "in today's fast-paced world",
    "in today's digital landscape",
    'unlock your potential',
    'delve into',
    'game-changing',
    'leveraging',
    'cutting-edge',
    'it has been an incredible journey',
    'this experience taught me',
  ];

  public detect(text: string): string[] {
    const lower = text.toLowerCase();
    const found: string[] = [];

    FillerDetector.FILLER_PHRASES.forEach((phrase) => {
      if (lower.includes(phrase)) {
        found.push(phrase);
      }
    });

    return found;
  }
}

export const fillerDetector = new FillerDetector();
