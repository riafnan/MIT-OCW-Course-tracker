const HISTORY_KEY = "ocw_history";
const LAST_KEY = "ocw_last";
const MAX_HISTORY = 50;

let lastSavedUrl = null;
let lastSavedTime = 0;

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
