export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isValidApiKey(apiKey: string): boolean {
  return isNonEmptyString(apiKey) && apiKey.startsWith('gsk_');
}
