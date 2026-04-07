const HISTORY_KEY = "ocw_history";
const LAST_KEY = "ocw_last";
const MAX_HISTORY = 50;

// Prevent duplicate entries from firing within a short window (e.g. during page redirects)
let lastSavedUrl = null;
let lastSavedTime = 0;

/**
 * Listen for tab updates. Status 'complete' ensures we capture the title 
 * after the DOM has loaded.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  trackUrl(tab.url, tab.title);
});

/**
 * Handle direct navigations (like clicking links) immediately to ensure
 * the tracker feels responsive even on slow connections.
 */
chrome.tabs.onCommitted.addListener((details) => {
  if (details.frameId !== 0 || !details.url) return;
  trackUrl(details.url, details.title);
});

/**
 * Main tracking logic: filters for OCW, manages the history stack,
 * and keeps the "last visited" pointer updated.
 */
function trackUrl(url, title) {
  if (!url.includes("ocw.mit.edu")) return;

  const now = Date.now();
  // Avoid spamming storage if the user refreshes or redirects rapidly
  if (url === lastSavedUrl && now - lastSavedTime < 3000) return;

  lastSavedUrl = url;
  lastSavedTime = now;

  const entry = { url, title: title || url, timestamp: now };

  chrome.storage.local.get([HISTORY_KEY], (result) => {
    let history = result[HISTORY_KEY] || [];
    
    // Remove existing entry for the same URL to move it to the top (MRU logic)
    history = history.filter((e) => e.url !== url);
    history.unshift(entry);
    
    // Cap history size to maintain extension performance
    if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
    
    chrome.storage.local.set({
      [HISTORY_KEY]: history,
      [LAST_KEY]: entry,
    });
  });
}
