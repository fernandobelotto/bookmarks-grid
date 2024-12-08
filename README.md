# Bookmarks Grid View - Chrome Extension

A modern Chrome extension that displays your bookmarks in a beautiful grid layout with powerful search and management capabilities.

## Features

- 📱 **Grid Layout**: View your bookmarks in a clean, responsive grid layout
- 🔍 **Quick Search**: Search through your bookmarks with instant filtering (⌘K / Ctrl+K shortcut)
- 📂 **Folder Organization**: Navigate through your bookmark folders using tabs
- 🖼️ **Smart Favicons**: Automatic favicon loading with multiple fallback sources
- ✏️ **Easy Editing**: Right-click context menu for quick editing and deletion
- 🎨 **Modern UI**: Built with shadcn/ui components for a beautiful, consistent look
- ⚡ **Fast Performance**: Optimized for speed and responsiveness

## Installation

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bookmarks-extension.git
cd bookmarks-extension
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

### Loading the Extension in Chrome

1. Build the extension:

```bash
npm run build
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `dist` directory from your project folder

The extension will now replace your new tab page with the bookmarks grid view.

## Development

- `npm run dev` - Starts the development server with hot reload
- `npm run build` - Builds the extension for production
- `npm run lint` - Runs the linter

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui Components
- Chrome Extensions API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project however you'd like.
