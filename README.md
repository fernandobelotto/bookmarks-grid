# Bookmarks Grid

A Chrome extension that replaces your new tab page with a fast, keyboard-driven bookmark manager in a beautiful grid layout.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)

## Features

- **Grid layout** — responsive, auto-filling grid that scales to your screen
- **Instant search** — filter bookmarks by title or URL in real time (`⌘K` / `Ctrl+K`)
- **Folder tabs** — navigate between top-level bookmark folders with a single click
- **Drag & drop** — reorder bookmarks within a folder (mouse or keyboard)
- **Full CRUD** — create, edit, and delete bookmarks via modal, context menu, or keyboard shortcuts
- **Smart favicons** — auto-loads favicons with DuckDuckGo → Google fallback chain
- **Dark mode** — toggle with a button, persisted across sessions
- **Keyboard-first** — every action has a shortcut, no mouse required

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Focus search |
| `N` | New bookmark |
| `E` | Edit hovered bookmark |
| `Backspace` | Delete hovered bookmark |
| Arrow keys | Move bookmark while dragging |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Build

```bash
git clone https://github.com/fernandobelotto/bookmarks-grid.git
cd bookmarks-grid
npm install
npm run build
```

### Load in Chrome

1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select the `dist/` folder

Your new tab page is now the bookmarks grid.

### Development

```bash
npm run dev    # watch mode — rebuilds on every file change
npm run build  # production build
npm run lint   # ESLint
```

After running `npm run dev`, reload the extension in `chrome://extensions/` to pick up changes.

## Project Structure

```
src/
├── App.tsx                     # Root: layout, dialogs, drag-drop orchestration
├── main.tsx                    # React entry point
├── components/
│   ├── SortableBookmark.tsx    # Bookmark card with context menu & drag handle
│   └── ui/                     # shadcn/ui primitives (dialog, tabs, input…)
├── hooks/
│   ├── useBookmarks.ts         # Load & filter bookmarks from Chrome API
│   ├── useBookmarkShortcuts.ts # E / Backspace hotkeys
│   ├── useDarkMode.ts          # Dark mode toggle + localStorage persistence
│   ├── useFavicons.ts          # Favicon fetching with fallback chain
│   └── useSearchShortcut.ts   # ⌘K / Ctrl+K focus
├── lib/
│   └── utils.ts                # cn() — clsx + tailwind-merge
└── types/
    └── chrome.d.ts             # Chrome Bookmarks API type definitions
public/
└── manifest.json               # Chrome Extension Manifest V3
```

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Components | Radix UI primitives |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Shortcuts | react-hotkeys-hook |
| Icons | Lucide React |

## License

MIT
