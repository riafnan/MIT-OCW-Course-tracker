# OCW Tracker

I built this Chrome extension for myself because I kept losing track of where I left off while studying on MIT OpenCourseware. It's a simple, personal tool that auto-tracks my OCW visits and gives me a quick way to jump back to my last session. 

I'm sharing it here in case anyone else finds it useful. Feel free to use it, tweak it, or fork it for your own study flow.

## What it does

- **Floating "Jump Back" Widget**: When you're on an OCW page, a small, sleek pill appears in the bottom-right corner reminding you of your last visited page. Click it to instantly return.
- **Auto-Tracking**: No setup required. Just browse `ocw.mit.edu` and it remembers your history.
- **Motivational Quotes**: A rotating pool of 150+ quotes in the popup to keep me focused when the grind gets heavy.
- **Zero Bloat / Privacy First**: Everything runs locally in your browser. No analytics, no external requests, no tracking.

## How to install

Since this is a personal project and not on the Chrome Web Store, you'll need to load it manually:

1. **Download the code**: Clone this repo or download it as a `.zip` and extract it.
2. **Open Chrome Extensions**: Go to `chrome://extensions/` in your browser.
3. **Enable Developer Mode**: Toggle the switch in the top-right corner.
4. **Load Unpacked**: Click the "Load unpacked" button and select the folder containing these files.

## How to use

- **Just browse**: Visit any page on `ocw.mit.edu`. The extension will silently track it.
- **Jump back**: If you're on a different OCW page than your last session, the corner widget will slide in. Click it to return.
- **Check history**: Click the extension icon to see your recent pages and a fresh quote.
- **Clear data**: Hit the 🗑️ icon in the popup header if you want to wipe your history.

## Tech notes

It's built with vanilla JS, HTML, and CSS (Manifest V3). No frameworks, no build steps. The floating widget uses a Shadow DOM to keep styles completely isolated from the MIT OCW website, so it won't break or slow down the page.
