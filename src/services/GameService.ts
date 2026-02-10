import { Game } from "../types";

// ─── Service: camada de dados PURA ───────────────────────────
// Sem React, sem state, sem UI.
// Recebe dados → processa → retorna dados.

const STORAGE_KEY = "game-tracker-list";

export const GameService = {

    // Carrega a lista salva do localStorage
    loadGames: (): Game[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Persiste a lista inteira no localStorage
    saveGames: (games: Game[]): void => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    },

    // Cria um novo jogo e retorna a lista atualizada
    addGame: (games: Game[], newGame: Omit<Game, "id">): Game[] => {
        const game: Game = {
            ...newGame,
            id: crypto.randomUUID(),
        };
        return [...games, game];
    },

    // Remove um jogo pelo id e retorna a lista atualizada
    deleteGame: (games: Game[], id: string): Game[] => {
        return games.filter(game => game.id !== id);
    },
};
