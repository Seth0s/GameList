import { SteamGame } from "../types/steam";

// ─── Service: chamadas à Steam API via IPC ──────────────────
// Funções puras, sem React, sem state.
// Usa window.steamAPI exposto pelo preload (contextBridge).

export const SteamService = {

    // Busca jogos por nome — endpoint storesearch
    // Retorna: items[] com { id, name, tiny_image }
    searchGames: async (query: string): Promise<SteamGame[]> => {
        try {
            const data = await window.steamAPI.search(query);

            if (!data?.items || data.items.length === 0) return [];

            return data.items.map((item: { id: number; name: string; tiny_image: string }) => ({
                id: String(item.id),
                name: item.name,
                image: item.tiny_image,
            }));
        } catch (error) {
            console.error("[SteamService.searchGames] Erro:", error);
            return [];
        }
    },

    // Busca detalhes de um jogo — endpoint appdetails
    // Retorna: name, header_image, short_description, release_date, metacritic
    getGameDetails: async (appId: string): Promise<SteamGame | null> => {
        try {
            const data = await window.steamAPI.getDetails(appId);

            const entry = data?.[appId];
            if (!entry?.success) return null;

            const details = entry.data;
            const steamCdn = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}`;
            return {
                id: String(details.steam_appid),
                name: details.name,
                image: `${steamCdn}/library_600x900.jpg`,
                bannerImage: `${steamCdn}/header.jpg`,
                description: details.short_description,
                releasedDate: details.release_date?.date,
                metacriticScore: details.metacritic?.score,
            };
        } catch (error) {
            console.error("[SteamService.getGameDetails] Erro:", error);
            return null;
        }
    },
};
