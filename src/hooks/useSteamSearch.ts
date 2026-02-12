import { useState, useEffect } from "react";
import { SteamGame } from "../types/steam";
import { SteamService } from "../services/SteamService";

// ─── Hook: busca de jogos na Steam ──────────────────────────
// Gerencia query, resultados, loading e jogo selecionado.
// Usa debounce de 300ms para todas as buscas (digitação, Enter, botão "+").

export const useSteamSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SteamGame[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        // Loading aparece imediatamente ao iniciar o debounce
        setIsLoading(true);

        const timer = setTimeout(() => {
            SteamService.searchGames(query)
                .then(setResults)
                .catch(() => setResults([]))
                .finally(() => setIsLoading(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [query, searchTrigger]);

    // Enter ou botão "+" → força re-trigger do debounce com loading
    const triggerSearch = () => {
        if (!query.trim()) return;
        setSearchTrigger((prev) => prev + 1);
    };

    const selectGame = (appId: string) => {
        // Preserva a tiny_image do search como fallback caso o CDN não tenha a capa
        const searchResult = results.find((g) => g.id === appId);
        const searchImage = searchResult?.image;
        setError(null);

        SteamService.getGameDetails(appId, searchImage)
            .then((game) => {
                if (game) {
                    setSelectedGame(game);
                } else {
                    setError("Não foi possível carregar os detalhes deste jogo.");
                    // Fallback: usa os dados básicos do search
                    if (searchResult) {
                        setSelectedGame({
                            id: searchResult.id,
                            name: searchResult.name,
                            image: searchResult.image,
                        });
                    }
                }
            })
            .catch(() => {
                setError("Erro de conexão ao buscar detalhes.");
                if (searchResult) {
                    setSelectedGame({
                        id: searchResult.id,
                        name: searchResult.name,
                        image: searchResult.image,
                    });
                }
            });
    };

    return {
        query,
        setQuery,
        results,
        isLoading,
        triggerSearch,
        selectGame,
        selectedGame,
        error,
    };
};
