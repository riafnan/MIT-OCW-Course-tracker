(function() {
  const LAST_KEY = "ocw_last";
  const PROGRESS_KEY = "ocw_progress";
  const PROGRESS_BAR_KEY = "ocw_progress_bar_dismissed";
  const currentUrl = window.location.href;

  // Verify if there's a different "last visited" page to return to
  chrome.storage.local.get([LAST_KEY], (result) => {
    const last = result[LAST_KEY];
    if (!last || last.url === currentUrl) return;

    injectWidget(last);
  });

  // --- PROGRESS TRACKING LOGIC ---
  function getCourseMetadata() {
    const url = window.location.href;
    const match = url.match(/ocw\.mit\.edu\/courses\/([^/]+)/);
    if (!match) return null;

    const courseId = match[1];
    let courseTitle = "";
    const titleEl = document.querySelector('meta[property="og:site_name"]');
    if (titleEl) {
      courseTitle = titleEl.getAttribute("content");
    } else {
      courseTitle = document.title.split("|")[0].trim();
    }

    // Identify unique content links in the sidebar to estimate total pages
    const navLinks = document.querySelectorAll('nav a[href*="/courses/' + courseId + '"]');
    const uniqueUrls = new Set();
    navLinks.forEach(link => {
      try {
        const linkUrl = new URL(link.href);
        const cleanUrl = linkUrl.origin + linkUrl.pathname.replace(/\/$/, "");
        uniqueUrls.add(cleanUrl);
      } catch (e) {}
    });

    if (uniqueUrls.size > 5) {
      return {
        courseId,
        courseTitle,
        totalItems: uniqueUrls.size,
        currentUrl: window.location.origin + window.location.pathname.replace(/\/$/, "")
      };
    }
    return null;
  }

  const metadata = getCourseMetadata();
  if (metadata) {
    chrome.runtime.sendMessage({
      type: "COURSE_METADATA",
      data: metadata
    });

    // Inject the floating progress bar
    injectProgressBar(metadata);
  }
  // --- END PROGRESS TRACKING ---

  function injectProgressBar(metadata) {
    const { courseId } = metadata;

    chrome.storage.local.get([PROGRESS_KEY, PROGRESS_BAR_KEY], (result) => {
      const progress = result[PROGRESS_KEY] || {};
      const dismissed = result[PROGRESS_BAR_KEY] || {};
      
      // Check if this course's progress bar was dismissed
      if (dismissed[courseId]) return;

      const courseProgress = progress[courseId];
      if (!courseProgress) return;

      const visited = courseProgress.visited || [];
      const total = courseProgress.total || 1;
      const percent = Math.min(100, Math.round((visited.length / total) * 100));

      createProgressBar(courseProgress.title || courseId, visited.length, total, percent, courseId);
    });
  }

  function createProgressBar(courseTitle, visited, total, percent, courseId) {
    const host = document.createElement('div');
    host.id = 'ocw-tracker-progress-host';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'closed' });

    const styles = `
      :host {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483646;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .progress-bar {
        background: rgba(15, 15, 20, 0.92);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(167, 139, 250, 0.3);
        border-radius: 16px;
        color: #fff;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(124, 58, 237, 0.2);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        max-width: 320px;
      }
      .progress-bar.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      .progress-bar.minimized {
        max-width: auto;
        width: auto;
      }
      .progress-bar.minimized .expanded-content {
        display: none;
      }
      .progress-bar:not(.minimized) .minimized-content {
        display: none;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 14px 8px;
        cursor: pointer;
      }
      .header:hover {
        background: rgba(255, 255, 255, 0.03);
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .icon {
        font-size: 16px;
        background: linear-gradient(135deg, #a78bfa, #60a5fa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .course-title {
        font-size: 13px;
        font-weight: 700;
        color: #e8e8ed;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 180px;
      }
      .percent-badge {
        background: linear-gradient(135deg, #7c3aed, #3b82f6);
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 800;
        color: #fff;
        margin-left: 8px;
      }
      .controls {
        display: flex;
        gap: 4px;
      }
      .btn {
        width: 26px;
        height: 26px;
        border-radius: 6px;
        border: none;
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: all 0.2s ease;
      }
      .btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
      .btn.minimize:hover {
        background: rgba(96, 165, 250, 0.2);
        color: #60a5fa;
      }
      .btn.close:hover {
        background: rgba(255, 95, 87, 0.2);
        color: #ff5f57;
      }
      .expanded-content {
        padding: 0 14px 14px;
      }
      .progress-info {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 8px;
      }
      .progress-label {
        font-size: 11px;
        color: #a5b4fc;
        font-weight: 600;
      }
      .progress-stats {
        font-size: 10px;
        color: #6b6b80;
      }
      .progress-bar-bg {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 100px;
        overflow: hidden;
        margin-bottom: 8px;
      }
      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #7c3aed, #60a5fa, #a78bfa);
        background-size: 200% 100%;
        border-radius: 100px;
        transition: width 0.6s cubic-bezier(0.65, 0, 0.35, 1);
        animation: shimmer 2s ease infinite;
      }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 10px;
      }
      .detail-item {
        background: rgba(255, 255, 255, 0.03);
        padding: 8px 10px;
        border-radius: 8px;
      }
      .detail-label {
        font-size: 9px;
        color: #6b6b80;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 2px;
      }
      .detail-value {
        font-size: 12px;
        font-weight: 700;
        color: #c4b5fd;
      }
      .minimized-content {
        padding: 10px 14px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .minimized-icon {
        font-size: 14px;
        background: linear-gradient(135deg, #a78bfa, #60a5fa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .minimized-percent {
        font-size: 12px;
        font-weight: 800;
        color: #fff;
      }
      .minimized-pip {
        display: flex;
        gap: 2px;
      }
      .pip {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
      }
      .pip.filled {
        background: linear-gradient(135deg, #7c3aed, #60a5fa);
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `;

    const container = document.createElement('div');
    container.className = 'progress-bar';
    container.innerHTML = `
      <div class="header">
        <div class="header-left">
          <span class="icon">📊</span>
          <span class="course-title">${courseTitle}</span>
          <span class="percent-badge">${percent}%</span>
        </div>
        <div class="controls">
          <button class="btn minimize" title="Minimize">−</button>
          <button class="btn close" title="Close">×</button>
        </div>
      </div>
      <div class="expanded-content">
        <div class="progress-info">
          <span class="progress-label">Course Progress</span>
          <span class="progress-stats">${visited} of ${total} pages</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${percent}%"></div>
        </div>
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Visited</div>
            <div class="detail-value">${visited}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Remaining</div>
            <div class="detail-value">${total - visited}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Total Pages</div>
            <div class="detail-value">${total}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Complete</div>
            <div class="detail-value">${percent}%</div>
          </div>
        </div>
      </div>
      <div class="minimized-content">
        <span class="minimized-icon">📊</span>
        <span class="minimized-percent">${percent}%</span>
        <div class="minimized-pip">
          ${Array(5).fill(0).map((_, i) => `<div class="pip ${i < Math.ceil(percent / 20) ? 'filled' : ''}"></div>`).join('')}
        </div>
      </div>
    `;

    const styleTag = document.createElement('style');
    styleTag.textContent = styles;
    shadow.appendChild(styleTag);
    shadow.appendChild(container);

    // Event handlers
    const header = container.querySelector('.header');
    const minimizeBtn = container.querySelector('.btn.minimize');
    const closeBtn = container.querySelector('.btn.close');

    function toggleMinimize() {
      container.classList.toggle('minimized');
      const isMinimized = container.classList.contains('minimized');
      minimizeBtn.textContent = isMinimized ? '+' : '−';
      minimizeBtn.title = isMinimized ? 'Expand' : 'Minimize';
    }

    function closeBar() {
      chrome.storage.local.get([PROGRESS_BAR_KEY], (result) => {
        const dismissed = result[PROGRESS_BAR_KEY] || {};
        dismissed[courseId] = true;
        chrome.storage.local.set({ [PROGRESS_BAR_KEY]: dismissed });
      });
      container.classList.remove('visible');
      setTimeout(() => host.remove(), 300);
    }

    header.addEventListener('click', (e) => {
      if (e.target.closest('.btn')) return;
      toggleMinimize();
    });

    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMinimize();
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeBar();
    });

    // Show with animation
    requestAnimationFrame(() => {
      setTimeout(() => {
        container.classList.add('visible');
      }, 100);
    });
  }

  /**
   * Injects a floating widget using Shadow DOM.
   */
  function injectWidget(last) {
    const host = document.createElement('div');
    host.id = 'ocw-tracker-widget-host';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'closed' });

    const styles = `
      :host {
        position: fixed;
        bottom: 90px;
        right: 24px;
        z-index: 2147483645;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .widget {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        background: rgba(15, 15, 20, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(167, 139, 250, 0.3);
        border-radius: 100px;
        color: #fff;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(124, 58, 237, 0.2);
        cursor: pointer;
        user-select: none;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        opacity: 0;
        transform: translateY(20px) scale(0.9);
      }
      .widget.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      .widget:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 40px rgba(124, 58, 237, 0.3);
        background: rgba(20, 20, 28, 0.95);
        border-color: rgba(167, 139, 250, 0.6);
      }
      .icon {
        font-size: 14px;
        background: linear-gradient(135deg, #a78bfa, #60a5fa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: pulse 2s infinite;
      }
      .text {
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
        max-width: 220px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .close {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.4);
        padding: 4px;
        margin-right: -4px;
        transition: color 0.2s;
      }
      .close:hover {
        color: #ff5f57;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; filter: drop-shadow(0 0 2px rgba(167, 139, 250, 0.5)); }
        50% { opacity: 0.7; filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.8)); }
      }
    `;

    const container = document.createElement('div');
    container.className = 'widget';
    container.innerHTML = `
      <span class="icon">✦</span>
      <div class="text">Jump back to: ${last.title || last.url}</div>
      <span class="close" title="Dismiss">×</span>
    `;

    const styleTag = document.createElement('style');
    styleTag.textContent = styles;
    shadow.appendChild(styleTag);
    shadow.appendChild(container);

    container.addEventListener('click', (e) => {
      if (e.target.className === 'close') {
        dismiss();
        return;
      }
      window.location.href = last.url;
    });

    function dismiss() {
      container.classList.remove('visible');
      setTimeout(() => host.remove(), 300);
    }

    requestAnimationFrame(() => {
      setTimeout(() => {
        container.classList.add('visible');
      }, 100);
    });

    setTimeout(() => {
      if (host.parentElement) dismiss();
    }, 15000);
  }
})();
