# MiniSport

MiniSport is a lightweight desktop file search and launcher built with Electron, React, and SQLite.

Its primary purpose is to make files in virtual directory mappings searchable when the operating system does not reliably index them. Such as Google Drive mounted in Finder or Explorer. MiniSport provides a local index that can be reconciled without depending on Windows USN journal events or macOS FSEvents.

Users can also add any folders on their local disk as workspaces and search their contents with a Spotlight-like workflow.

## Features

- Global quick-search hotkeys
  - Ctrl/Cmd + Shift + Space
  - Alt + Shift + Space
  - Ctrl/Cmd + Shift + Q to quit the app
- Multi-workspace support
  - Add and remove folders to index
- Fast file and folder search
  - Uses SQLite FTS5 indexes for efficient keyword matching
  - Includes fallback name and path matching
- Idle-time reconciliation
  - Automatically reconciles the index after 3 minutes of no user input
  - Keeps the local file catalog current without continuous background scanning
- File usage ranking
  - Frequently opened items can rise in the result order
- Result actions
  - Open files/folders directly from the result list
  - Optional Google search fallback when a query is not found locally
- Cross-platform desktop app
  - Built for macOS and Windows packaging via Electron Builder

## Tech Stack

- Electron
- React 19
- TypeScript
- Vite
- better-sqlite3
- SQLite FTS5
- winston

## How It Works

MiniSport keeps a local SQLite database that stores indexed files and workspace metadata. The app boots a background indexer, scans configured folders, and records each file with metadata such as:

- file name
- full path
- parent folder
- folder/file flag
- creation/update timestamps
- usage count

The renderer UI queries the local database and presents the results in a compact overlay window, while periodic reconciliation keeps the file catalog aligned with the current workspace state.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Build the project

```bash
npm run build
```

This compiles the Electron main process and the React renderer.

### Run the app

```bash
npm start
```

This launches the Electron app using the local database configuration.

### Start the frontend dev server

```bash
npm run dev
```

This starts the Vite development server for the UI layer.

## Packaging for Distribution

```bash
npm run dist
```

This executes the build and packages the app with Electron Builder into the `release/` directory.

## Typical Usage

1. Launch MiniSport.
2. Use the global hotkey to bring up the search window.
3. Add one or more folders as workspaces.
4. Type a file or folder name.
5. Select a result to open it in the default OS application.
6. Use Escape, the hotkey again, or mouse focus loss from the search bar to hide the overlay.
7. Use Ctrl/Cmd + Shift + Q to quit the app.

## Notes

- The app is primarily intended for virtual directory mappings and other locations that do not integrate cleanly with the OS file indexer. Users can also add and index any local-disk folders.
- Search quality depends on the size and organization of the indexed workspaces.
- Logs are generated under the app's user-data directory and can be useful when debugging indexing or filesystem issues.

## License

This project is licensed under the ISC license. See [LICENSE](./LICENSE) for the full text.
