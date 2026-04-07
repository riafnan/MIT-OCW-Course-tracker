# OCW Tracker

A lightweight, premium Chrome extension that auto-tracks your MIT OpenCourseware (OCW) progress and helps you stay focused on your learning journey.

## Features

- **Proactive Corner Widget**: A sleek, glassmorphic pill that appears in the bottom-right corner when you're on MIT OCW, allowing you to jump back to your last visited page instantly.
- **Smart Tracking**: Automatically remembers the last page you visited and maintains a history of your most recent study sessions.
- **Motivational Quotes**: Features over 150+ hand-picked quotes to keep you disciplined and inspired while you study.
- **Premium Aesthetic**: Modern "dark mode" design with smooth, GPU-accelerated animations and glassmorphism effects.
- **Privacy Focused**: All data is stored locally in your browser using `chrome.storage.local`. No external servers or tracking.
- **Zero Bloat**: Extremely lightweight implementation with no external dependencies or heavy assets.

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top right corner).
4. Click **Load unpacked** and select the `ocw-tracker` directory.

## Usage

- **Automatic Tracking**: Just browse MIT OCW. The extension will automatically save your progress.
- **Jump Back**: Use the "Resume Learning" button in the popup or the floating widget on the site to return to your last session.
- **History**: View your last 7 visited pages in the popup for quick navigation.
- **Clear History**: Click the 🗑️ icon in the popup header to reset your tracking data.

## Architecture

- `manifest.json`: Extension configuration (Manifest V3).
- `background.js`: Service worker for tracking URL changes and managing storage.
- `content.js`: Lightweight Shadow DOM widget injected into OCW pages.
- `popup.html/js/css`: The main UI for history and motivation.

