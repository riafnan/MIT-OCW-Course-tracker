const HISTORY_KEY = "ocw_history";
const LAST_KEY = "ocw_last";
const PROGRESS_KEY = "ocw_progress";
const MAX_HISTORY = 50;

let lastSavedUrl = null;
let lastSavedTime = 0;

// Track tab updates for history
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url) return;
  if (!tab.url.includes("ocw.mit.edu")) return;

  const now = Date.now();
  if (tab.url === lastSavedUrl && now - lastSavedTime < 3000) return;

  lastSavedUrl = tab.url;
  lastSavedTime = now;

  chrome.storage.local.get([HISTORY_KEY], (result) => {
    let history = result[HISTORY_KEY] || [];
    history = history.filter((e) => e.url !== tab.url);
    history.unshift({ url: tab.url, title: tab.title || tab.url, timestamp: now });
    if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
    chrome.storage.local.set({ [HISTORY_KEY]: history, [LAST_KEY]: history[0] });
  });
});

// Handle metadata from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "COURSE_METADATA") {
    const { courseId, courseTitle, totalItems, currentUrl } = message.data;
    
    chrome.storage.local.get([PROGRESS_KEY], (result) => {
      const progress = result[PROGRESS_KEY] || {};
      
      if (!progress[courseId]) {
        progress[courseId] = {
          title: courseTitle,
          total: totalItems,
          visited: []
        };
      } else {
        // Update total if it changed significantly (ocw updates)
        progress[courseId].total = totalItems;
        progress[courseId].title = courseTitle;
      }

      // Add current URL to visited if not already there
      const cleanUrl = currentUrl.replace(/\/$/, "");
      if (!progress[courseId].visited.includes(cleanUrl)) {
        progress[courseId].visited.push(cleanUrl);
      }

      chrome.storage.local.set({ [PROGRESS_KEY]: progress });
    });
  }
});
