import { useState, useEffect } from "react";
import { Game } from "../types";
import { GameService } from "../services/GameService";

// ─── Hook: ponte entre Service e UI ─────────────────────────
// Gerencia state React + chama o service para operar dados.
// Retorna tudo que o componente precisa: dados + ações.

export const useGameList = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Ao montar, carrega os jogos salvos
    useEffect(() => {
        const saved = GameService.loadGames();
        setGames(saved);
    }, []);

    // ─── Ações ───────────────────────────────────────────────

    const addGame = (newGame: Omit<Game, "id">) => {
        const updated = GameService.addGame(games, newGame);
        setGames(updated);
        setIsModalOpen(false);
    };

    const deleteGame = (id: string) => {
        const updated = GameService.deleteGame(games, id);
        setGames(updated);
    };

    const saveGames = () => {
        GameService.saveGames(games);
    };

    const toggleDeleteMode = () => {
        setIsDeleteMode(prev => !prev);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // ─── Retorno ─────────────────────────────────────────────
    // Tudo que a UI precisa: dados + flags + funções de ação

    return {
        // Dados
        games,
        isDeleteMode,
        isModalOpen,

        // Ações
        addGame,
        deleteGame,
        saveGames,
        toggleDeleteMode,
        openModal,
        closeModal,
    };
};
