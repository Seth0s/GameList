import { useState, useEffect, useCallback } from "react";
import { Game } from "../types";
import { GameService } from "../services/GameService";

// ─── Hook: ponte entre Service e UI ─────────────────────────
// Gerencia state React + chama o service (async/IPC) para operar dados.
// Cada operação persiste automaticamente no SQLite — sem botão "Salvar".

export const useGameList = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Carrega os jogos do banco ao montar
    const refreshGames = useCallback(async () => {
        const saved = await GameService.loadGames();
        setGames(saved);
    }, []);

    useEffect(() => {
        refreshGames();
    }, [refreshGames]);

    // ─── Ações (async — cada uma persiste no banco) ─────────

    const addGame = async (newGame: Omit<Game, "id">) => {
        await GameService.addGame(newGame);
        await refreshGames();
        setIsModalOpen(false);
    };

    const deleteGame = async (id: string) => {
        await GameService.deleteGame(id);
        await refreshGames();
    };

    const toggleDeleteMode = () => {
        setIsDeleteMode(prev => !prev);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // ─── Retorno ─────────────────────────────────────────────

    return {
        // Dados
        games,
        isDeleteMode,
        isModalOpen,

        // Ações
        addGame,
        deleteGame,
        toggleDeleteMode,
        openModal,
        closeModal,
    };
};
