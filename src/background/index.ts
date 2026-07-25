// PostKit — Background Service Worker
// Manages extension lifecycle and side panel behavior.

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
