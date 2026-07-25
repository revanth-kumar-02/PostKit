/**
 * Chrome API Availability Helper
 * Allows graceful fallback when running in a standard web browser context during UI development.
 */
export const isChromeExtension = (): boolean => {
  return (
    typeof chrome !== 'undefined' &&
    typeof chrome.runtime !== 'undefined' &&
    Boolean(chrome.runtime.id)
  );
};

export const hasSidePanelSupport = (): boolean => {
  return isChromeExtension() && typeof chrome.sidePanel !== 'undefined';
};

export const hasStorageSupport = (): boolean => {
  return isChromeExtension() && typeof chrome.storage !== 'undefined';
};
