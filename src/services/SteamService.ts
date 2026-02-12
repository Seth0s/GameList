import { SteamGame } from "../types/steam";

// ─── Service: chamadas à Steam API via IPC ──────────────────
// Funções puras, sem React, sem state.
// Usa window.steamAPI exposto pelo preload (contextBridge).

/**
 * Verifica uma lista de URLs de imagem e retorna a primeira que existe.
 * Usa HEAD request via IPC (sem CORS, roda no main process).
 * Se nenhuma existir, retorna o fallback.
 */
const findValidImage = async (candidates: string[], fallback: string): Promise<string> => {
    for (const url of candidates) {
        const exists = await window.steamAPI.checkImage(url);
        if (exists) return url;
    }
    return fallback;
};

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
                image: item.tiny_image, // imagem garantida (veio da API)
            }));
        } catch (error) {
            console.error("[SteamService.searchGames] Erro:", error);
            return [];
        }
    },

    // Busca detalhes de um jogo — endpoint appdetails
    // Valida existência das imagens no CDN antes de retornar.
    // Cadeia de fallback para a capa:
    //   1. library_600x900.jpg (vertical, ideal)
    //   2. library_600x900_2x.jpg (alta resolução)
    //   3. capsule_616x353.jpg (horizontal, muito comum)
    //   4. header.jpg (banner, sempre existe)
    //   5. tiny_image do search (último recurso)
    getGameDetails: async (appId: string, searchImage?: string): Promise<SteamGame | null> => {
        try {
            const data = await window.steamAPI.getDetails(appId);

            const entry = data?.[appId];
            if (!entry?.success) return null;

            const details = entry.data;
            const steamCdn = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}`;

            // Cadeia de fallback para a capa vertical
            const coverCandidates = [
                `${steamCdn}/library_600x900.jpg`,
                `${steamCdn}/library_600x900_2x.jpg`,
                `${steamCdn}/capsule_616x353.jpg`,
                details.header_image, // URL direta da API (header)
            ].filter(Boolean) as string[];

            // Fallback final: imagem do search ou string vazia
            const coverFallback = searchImage || "";

            // Banner: header.jpg é quase universal, mas valida também
            const bannerCandidates = [
                `${steamCdn}/header.jpg`,
                details.header_image,
            ].filter(Boolean) as string[];

            // Valida imagens em paralelo
            const [image, bannerImage] = await Promise.all([
                findValidImage(coverCandidates, coverFallback),
                findValidImage(bannerCandidates, ""),
            ]);

            // Extrai gêneros da API: [{ id, description }] → "Action, Adventure"
            const genre = Array.isArray(details.genres)
                ? details.genres.map((g: { description: string }) => g.description).join(", ")
                : undefined;

            return {
                id: String(details.steam_appid),
                name: details.name,
                image,
                bannerImage: bannerImage || undefined,
                genre,
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
