export function isLinkedInPage(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.includes('linkedin.com');
}
