(function() {
  const LAST_KEY = "ocw_last";
  const currentUrl = window.location.href;

  // Verify if there's a different "last visited" page to return to
  chrome.storage.local.get([LAST_KEY], (result) => {
    const last = result[LAST_KEY];
    if (!last || last.url === currentUrl) return;

    injectWidget(last);
  });

  /**
   * Injects a floating widget using Shadow DOM.
   * Shadow DOM is used to ensure the widget's styles (like .text or .icon)
   * don't conflict with MIT OCW's own CSS classes.
   */
  function injectWidget(last) {
    const host = document.createElement('div');
    host.id = 'ocw-tracker-widget-host';
    document.body.appendChild(host);

    // mode: 'closed' provides higher isolation
    const shadow = host.attachShadow({ mode: 'closed' });

    // Styles are defined inside the Shadow Root to keep them encapsulated
    const styles = `
      :host {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647; /* Ensure it stays above MIT's navigation bars */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .widget {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        background: rgba(15, 15, 20, 0.85);
        backdrop-filter: blur(12px); /* Glassmorphism effect */
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(167, 139, 250, 0.3);
        border-radius: 100px;
        color: #fff;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(124, 58, 237, 0.2);
        cursor: pointer;
        user-select: none;
        /* GPU-accelerated transitions for 60fps performance */
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

    // Event Delegation for the close button vs the widget body
    container.addEventListener('click', (e) => {
      if (e.target.className === 'close') {
        dismiss();
        return;
      }
      window.location.href = last.url;
    });

    function dismiss() {
      container.classList.remove('visible');
      // Delay removal to allow the "slide out" animation to finish
      setTimeout(() => host.remove(), 300);
    }

    // Delay showing slightly to let the page settle
    requestAnimationFrame(() => {
      setTimeout(() => {
        container.classList.add('visible');
      }, 100);
    });

    // Auto-dismiss after 15 seconds to avoid being intrusive
    setTimeout(() => {
      if (host.parentElement) dismiss();
    }, 15000);
  }
})();
