# CLAUDE.md

## Project

Chrome Extension (Manifest V3) that replaces the new tab page with a keyboard-driven bookmark grid. Built with React + TypeScript + Vite.

## Commands

```bash
pnpm dev         # watch mode (vite build --watch) — reload extension manually after changes
pnpm build       # tsc + vite build → outputs to dist/
pnpm lint        # ESLint strict mode
```

## Architecture

- **`src/App.tsx`** — top-level state: open dialogs, selected bookmark, drag-drop context
- **`src/hooks/useBookmarks.ts`** — reads from `chrome.bookmarks` API, filters by folder and search query
- **`src/components/SortableBookmark.tsx`** — single bookmark card; handles context menu, hover state, drag handle
- **`public/manifest.json`** — Chrome Extension Manifest V3; `newtab` override + `bookmarks` permission

## Chrome API Usage

All bookmark reads/writes go through `chrome.bookmarks.*`. There is no backend.

- Read: `chrome.bookmarks.getTree()`, `chrome.bookmarks.getChildren()`
- Write: `chrome.bookmarks.create()`, `chrome.bookmarks.update()`, `chrome.bookmarks.remove()`
- Reorder: `chrome.bookmarks.move()`

The extension must be loaded in Chrome to access these APIs. They are not available in the browser dev server.

## Development Workflow

1. `npm run dev` — starts watch mode
2. Go to `chrome://extensions/` → click the reload icon on the extension card after each build
3. Open a new tab to see changes

## Key Conventions

- Components live in `src/components/`, reusable hooks in `src/hooks/`
- UI primitives come from shadcn/ui (`src/components/ui/`) — do not edit these files directly; regenerate via `shadcn` CLI if updates are needed
- Use `cn()` from `src/lib/utils.ts` for all className merging (clsx + tailwind-merge)
- Dark mode is class-based (`dark` on `<html>`), toggled via `useDarkMode` hook, persisted in `localStorage`
- Favicon loading uses a waterfall: DuckDuckGo → Google → inline SVG fallback (see `useFavicons.ts`)

## Shortcuts

Hotkeys are managed via `react-hotkeys-hook`. Search shortcut (`⌘K`/`Ctrl+K`) is in `useSearchShortcut.ts`; bookmark-level shortcuts (E, Backspace) are in `useBookmarkShortcuts.ts`. The search input must be excluded from bookmark hotkeys to avoid conflicts — see the `enableOnFormTags` option usage.
