import { Game } from "../types";

// ─── Service: camada de dados via IPC → SQLite ──────────────
// Sem React, sem state, sem UI.
// Todas as operações são async (passam pelo IPC para o main process).

export const GameService = {

    // Carrega todos os jogos do banco
    loadGames: async (): Promise<Game[]> => {
        return await window.gameDB.getAll();
    },

    // Adiciona um novo jogo ao banco (gera o id aqui)
    addGame: async (newGame: Omit<Game, "id">): Promise<Game> => {
        const game: Game = {
            ...newGame,
            id: crypto.randomUUID(),
        };
        return await window.gameDB.add(game);
    },

    // Remove um jogo pelo id
    deleteGame: async (id: string): Promise<void> => {
        await window.gameDB.delete(id);
    },
};
