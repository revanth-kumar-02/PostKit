import { logger } from '@/lib/logger';

/**
 * PostKit V2 Background Service Worker
 * Manages extension lifecycle, side panel click behaviors, and inter-surface message routing.
 */

chrome.runtime.onInstalled.addListener(() => {
  logger.info('PostKit V2 Extension Service Worker installed successfully.');

  // Set side panel to open on extension icon click
  if (chrome.sidePanel && typeof chrome.sidePanel.setPanelBehavior === 'function') {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((err) => {
      logger.error('Failed to configure side panel action click behavior:', err);
    });
  }
});
