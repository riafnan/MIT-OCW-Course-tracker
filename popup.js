const QUOTES = [
  // ... (keeping existing quotes)
];

const HISTORY_KEY = "ocw_history";
const LAST_KEY = "ocw_last";

function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

/**
 * Returns a human-readable relative time string.
 */
function formatTime(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString();
}

/**
 * Heuristic to extract a meaningful course/page name from OCW URLs.
 * Example: 'ocw.mit.edu/courses/18-01-calculus/...' -> '18 01 CALCULUS'
 */
function extractCourseName(url) {
  const match = url.match(/ocw\.mit\.edu\/courses\/([^/]+)/);
  if (match) return match[1].replace(/-/g, " ").toUpperCase();
  try {
    return new URL(url).hostname + new URL(url).pathname.split("/").slice(0, 3).join("/");
  } catch {
    return url.substring(0, 50);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const quoteText = document.getElementById("quoteText");
  const quoteBox = document.getElementById("quoteBox");
  const resumeBtn = document.getElementById("resumeBtn");
  const btnText = document.getElementById("btnText");
  const historyList = document.getElementById("historyList");
  const emptyState = document.getElementById("emptyState");
  const clearBtn = document.getElementById("clearBtn");

  const quote = getRandomQuote();
  quoteText.textContent = `"${quote}"`;

  // Wipe all local data and refresh the UI to the empty state
  clearBtn.addEventListener("click", () => {
    if (confirm("Clear your OCW study history?")) {
      chrome.storage.local.clear(() => {
        window.location.reload();
      });
    }
  });

  // Entrance animation for the quote box
  quoteBox.style.opacity = "0";
  quoteBox.style.transform = "translateY(8px)";
  requestAnimationFrame(() => {
    quoteBox.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    quoteBox.style.opacity = "1";
    quoteBox.style.transform = "translateY(0)";
  });

  chrome.storage.local.get([LAST_KEY, HISTORY_KEY], (result) => {
    const last = result[LAST_KEY];
    const history = result[HISTORY_KEY] || [];

    // Toggle empty state UI if no data is found
    if (!last || history.length === 0) {
      emptyState.style.display = "block";
      resumeBtn.style.display = "none";
      document.querySelector(".history-section").style.display = "none";
      return;
    }

    resumeBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: last.url });
    });

    btnText.textContent = "Resume: " + (last.title || extractCourseName(last.url));

    // Render the most recent 7 items with a staggered entrance animation
    const items = history.slice(0, 7);
    items.forEach((entry, i) => {
      const el = document.createElement("a");
      el.className = "history-item";
      el.href = "#";
      el.style.opacity = "0";
      el.style.transform = "translateX(-8px)";
      el.innerHTML = `
        <span class="history-url">${extractCourseName(entry.url)}</span>
        <span class="history-time">${formatTime(entry.timestamp)}</span>
      `;
      el.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: entry.url });
      });
      historyList.appendChild(el);

      // Staggered delay based on index for a premium "pop-in" feel
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.transition = "opacity 0.2s ease, transform 0.2s ease";
          el.style.opacity = "1";
          el.style.transform = "translateX(0)";
        }, i * 60);
      });
    });
  });
});

    }
  });

  quoteBox.style.opacity = "0";
  quoteBox.style.transform = "translateY(8px)";
  requestAnimationFrame(() => {
    quoteBox.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    quoteBox.style.opacity = "1";
    quoteBox.style.transform = "translateY(0)";
  });

  chrome.storage.local.get([LAST_KEY, HISTORY_KEY], (result) => {
    const last = result[LAST_KEY];
    const history = result[HISTORY_KEY] || [];

    if (!last || history.length === 0) {
      emptyState.style.display = "block";
      resumeBtn.style.display = "none";
      document.querySelector(".history-section").style.display = "none";
      return;
    }

    resumeBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: last.url });
    });

    btnText.textContent = "Resume: " + (last.title || extractCourseName(last.url));

    const items = history.slice(0, 7);
    items.forEach((entry, i) => {
      const el = document.createElement("a");
      el.className = "history-item";
      el.href = "#";
      el.style.opacity = "0";
      el.style.transform = "translateX(-8px)";
      el.innerHTML = `
        <span class="history-url">${extractCourseName(entry.url)}</span>
        <span class="history-time">${formatTime(entry.timestamp)}</span>
      `;
      el.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: entry.url });
      });
      historyList.appendChild(el);

      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.transition = "opacity 0.2s ease, transform 0.2s ease";
          el.style.opacity = "1";
          el.style.transform = "translateX(0)";
        }, i * 60);
      });
    });
  });
});
