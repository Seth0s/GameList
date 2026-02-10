# 🎮 Game Tracker

Desktop app to track and manage the games you've completed. Built with Electron + React + TypeScript, featuring Steam API integration, SQLite persistence, and a modern dark UI.

## Preview

Each game card displays a vertical cover art with a background banner, along with name, rating, and completion date. The interface is frameless with custom window controls and a dark theme with golden accents.

## Features

- **Steam API Integration** — search games by name and automatically import cover art, banner, and basic info
- **SQLite Persistence** — local database via `better-sqlite3`, data persists reliably across sessions
- **Multi-image Cards** — vertical cover art + background banner for a rich visual experience
- **Personal Rating** — rate each finished game from 0 to 10
- **Delete Mode** — quickly remove games from your list
- **Frameless Window** — custom title bar with minimize, maximize, and close controls
- **Leaderboard** *(coming soon)* — button present in UI, functionality planned for future releases

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Runtime     | Electron 40             |
| Frontend    | React 19 + TypeScript   |
| Bundler     | Vite 7                  |
| Styling     | Tailwind CSS 4          |
| Database    | better-sqlite3 (SQLite) |
| Lint        | ESLint + TS parser      |
| Build       | electron-builder        |
| CI/CD       | GitHub Actions          |

## Project Structure

```
electron/
├── main.ts             # Main process — IPC handlers, window, Steam API proxy
├── preload.ts          # Context bridge (steamAPI, gameDB, windowAPI)
├── database.ts         # SQLite init + CRUD operations
└── electron-env.d.ts   # Window interface typings

src/
├── types/              # Interfaces (Game, SteamGame)
├── services/           # Pure data operations (GameService, SteamService)
├── hooks/              # React state management (useGameList, useSteamSearch)
├── components/         # Visual components (GameCard, ModalGame)
├── constant/           # Centralized color palette
├── App.tsx             # Root component — orchestrates hooks + UI
├── main.tsx            # React entry point
└── index.css           # Tailwind + base styles
```

**Data flow:**

```
App.tsx → useGameList()   → GameService   → IPC → SQLite
       → useSteamSearch() → SteamService  → IPC → Steam API
```

## Getting Started

```bash
# Install dependencies
npm install

# Rebuild native modules for Electron
npx @electron/rebuild

# Development mode (Vite + Electron with HMR)
npm run dev

# Production build
npm run build
```

## Download

Pre-built binaries for **Windows**, **Linux**, and **macOS** are available on the [Releases](https://github.com/Seth0s/GameList/releases) page.

## Author

Made by **[@Seth0s](https://github.com/Seth0s)**.
