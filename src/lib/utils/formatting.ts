export function formatCharacterCount(current: number, max: number): string {
  return `${current.toLocaleString()} / ${max.toLocaleString()}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}
