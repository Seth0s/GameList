import { GameCard } from "./components/GameCard"
import { colors } from "./constant/colors"
import { useGameList } from "./hooks/useGameList"


function App() {
  // O hook retorna TUDO que a UI precisa — dados + ações
  const {
    games,
    isDeleteMode,
    saveGames,
    openModal,
    toggleDeleteMode,
    deleteGame,
  } = useGameList()

  return (
    <>
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/5" style={{ backgroundColor: colors.surface }}>
          <div id="title" className="flex items-center gap-2 text-xl font-bold tracking-wide" style={{ color: colors.textPrimary }}>
               <h1>🏆 Game Tracker - Zerados</h1>
          </div>
          <span className="text-lg cursor-pointer hover:text-slate-400 transition-colors" style={{ color: colors.textDark }}>⚙</span>
      </header>
      <nav className="py-3.5 px-5 border-b border-white/4" style={{ backgroundColor: colors.surface }}>
          <div id="tools" className="flex flex-row justify-center gap-14">
              <button onClick={openModal} className="flex flex-col items-center gap-1.5 bg-transparent border-none text-sm px-3 py-2 rounded-lg transition-colors hover:text-slate-100 hover:bg-white/5" style={{ color: colors.textSecondary }}>Add Game</button>
              <button onClick={saveGames} className="flex flex-col items-center gap-1.5 bg-transparent border-none text-sm px-3 py-2 rounded-lg transition-colors hover:text-slate-100 hover:bg-white/5" style={{ color: colors.textSecondary }}>Save List</button>
              <button onClick={toggleDeleteMode} className="flex flex-col items-center gap-1.5 bg-transparent border-none text-sm px-3 py-2 rounded-lg transition-colors hover:text-slate-100 hover:bg-white/5" style={{ color: isDeleteMode ? colors.accent : colors.textSecondary }}>Delete Mode</button>
          </div>
      </nav>
      <main className="flex-1 p-4 overflow-y-auto">
          <div id="content" className="grid grid-cols-2 gap-2.5">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isDeleteMode={isDeleteMode}
                onDelete={deleteGame}
              />
            ))}
          </div>
      </main>
      <footer className="py-3 px-5 border-t border-white/5" style={{ backgroundColor: colors.surface }}>
          <div id="footer" className="flex flex-col items-center justify-center gap-1">
            <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>Total games: {games.length}</p>
            <p className="text-[0.68rem]" style={{ color: colors.textDark }}>Widget made by @Seth0s, feel free to use it</p>
          </div>
      </footer>
    </>
  )
}

export default App
