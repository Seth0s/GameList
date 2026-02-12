import { useState } from "react"
import { GameCard } from "./components/GameCard"
import { ModalGame } from "./components/ModalGame"
import { StatsPanel } from "./components/StatsPanel"
import { UpdateNotifier } from "./components/UpdateNotifier"
import { colors } from "./constant/colors"
import { useGameList } from "./hooks/useGameList"
import { useAdaptiveTheme } from "./hooks/useAdaptiveTheme"

type ActiveView = "games" | "stats"

function App() {
  const {
    games,
    isDeleteMode,
    isModalOpen,
    addGame,
    openModal,
    closeModal,
    toggleDeleteMode,
    deleteGame,
  } = useGameList()

  const { applyTheme, activeGameId } = useAdaptiveTheme()
  const [activeView, setActiveView] = useState<ActiveView>("games")

  return (
    <>
      <header className="shrink-0 drag-region flex items-center justify-between px-5 py-3.5 border-b border-white/5 z-20" style={{ backgroundColor: colors.surface }}>
          <div id="title" className="flex items-center gap-2 text-xl font-bold tracking-wide" style={{ color: colors.textPrimary }}>
               <h1>🏆 Game Tracker</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => window.windowAPI.minimize()}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors hover:bg-white/10"
              style={{ color: colors.textMuted }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <button
              onClick={() => window.windowAPI.maximize()}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors hover:bg-white/10"
              style={{ color: colors.textMuted }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </button>
            <button
              onClick={() => window.windowAPI.close()}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors hover:bg-red-500/80 hover:text-white"
              style={{ color: colors.textMuted }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>
      </header>
      <nav className="shrink-0 py-3.5 px-5 border-b border-white/4 z-20" style={{ backgroundColor: colors.surface }}>
          <div id="tools" className="flex flex-row justify-center gap-14">
              {/* Home — volta para a lista de games */}
              <button
                onClick={() => setActiveView("games")}
                className="flex flex-col items-center gap-1.5 bg-transparent border-none text-sm px-3 py-2 rounded-lg transition-colors hover:text-slate-100 hover:bg-white/5"
                style={{ color: activeView === "games" ? colors.accent : colors.textSecondary }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Home
              </button>

              {/* Add Game — desabilitado fora da aba Home */}
              <button
                onClick={openModal}
                disabled={activeView !== "games"}
                className={`flex flex-col items-center gap-1.5 bg-transparent border-none text-sm px-3 py-2 rounded-lg transition-colors ${
                  activeView !== "games" ? "opacity-40 cursor-not-allowed" : "hover:text-slate-100 hover:bg-white/5"
                }`}
                style={{ color: colors.textSecondary }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Add Game
              </button>

              {/* Delete Mode — desabilitado fora da aba Home */}
              <button
                onClick={toggleDeleteMode}
                disabled={activeView !== "games"}
                className={`flex flex-col items-center gap-1.5 bg-transparent border-none text-sm px-3 py-2 rounded-lg transition-colors ${
                  activeView !== "games" ? "opacity-40 cursor-not-allowed" : "hover:text-slate-100 hover:bg-white/5"
                }`}
                style={{ color: isDeleteMode && activeView === "games" ? colors.accent : colors.textSecondary }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Delete Mode
              </button>

              {/* Stats */}
              <button
                onClick={() => setActiveView("stats")}
                className="flex flex-col items-center gap-1.5 bg-transparent border-none text-sm px-3 py-2 rounded-lg transition-colors hover:text-slate-100 hover:bg-white/5"
                style={{ color: activeView === "stats" ? colors.accent : colors.textSecondary }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V10" />
                  <path d="M12 20V4" />
                  <path d="M6 20v-6" />
                </svg>
                Stats
              </button>

              {/* Leaderboard — em breve */}
              <button
                disabled
                className="relative flex flex-col items-center gap-1.5 bg-transparent border-none text-sm px-3 py-2 rounded-lg opacity-50 cursor-not-allowed"
                style={{ color: colors.textMuted }}
                title="Em breve"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
                Leaderboard
                <span
                  className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full text-[0.55rem] font-bold leading-none"
                  style={{ backgroundColor: colors.accent, color: "#1a1d24" }}
                >
                  SOON
                </span>
              </button>
          </div>
      </nav>

      {/* ── Conteúdo: Games ou Stats ──────────────────────── */}
      {activeView === "games" ? (
        <main className="flex-1 p-4 overflow-y-auto">
            <div id="content" className="grid grid-cols-2 gap-2.5">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isDeleteMode={isDeleteMode}
                  isActive={activeGameId.current === game.id}
                  onDelete={deleteGame}
                  onSelect={applyTheme}
                />
              ))}
            </div>
        </main>
      ) : (
        <StatsPanel games={games} />
      )}

      <footer className="shrink-0 py-3 px-5 border-t border-white/5" style={{ backgroundColor: colors.surface }}>
          <div id="footer" className="flex flex-col items-center justify-center gap-1">
            <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>Total games: {games.length}</p>
            <a href="https://github.com/Seth0s" target="_blank" className="text-[0.68rem]" style={{ color: colors.textDark }}>Widget made by @Seth0s</a>
          </div>
      </footer>

      {/* Modal — fora de qualquer botão, no final do JSX */}
      <ModalGame
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddGame={addGame}
      />
      <UpdateNotifier />
    </>
  )
}

export default App
