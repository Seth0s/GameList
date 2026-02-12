import { useMemo } from "react";
import { Game } from "../types";

// ─── Tipos dos dados computados ─────────────────────────────

export interface YearData {
    year: string;
    count: number;
}

export interface GenreData {
    name: string;
    value: number;
    percent: number;
}

export interface RatingBucket {
    range: string;
    count: number;
}

export interface GameStats {
    // Cards numéricos
    totalGames: number;
    averageRating: number;
    bestGame: { name: string; rating: number } | null;
    topGenre: string;

    // Dados para gráficos
    gamesPerYear: YearData[];
    genreBreakdown: GenreData[];
    ratingDistribution: RatingBucket[];
}

// ─── Hook ───────────────────────────────────────────────────

export const useGameStats = (games: Game[]): GameStats => {
    return useMemo(() => {
        // ── Total ────────────────────────────────────────────
        const totalGames = games.length;

        // ── Nota média ───────────────────────────────────────
        const averageRating =
            totalGames > 0
                ? Math.round((games.reduce((sum, g) => sum + g.rating, 0) / totalGames) * 10) / 10
                : 0;

        // ── Melhor jogo ──────────────────────────────────────
        const bestGame =
            totalGames > 0
                ? games.reduce(
                      (best, g) => (g.rating > best.rating ? g : best),
                      games[0],
                  )
                : null;

        // ── Jogos por ano ────────────────────────────────────
        const yearMap = new Map<string, number>();
        for (const game of games) {
            // dateFinished é DD/MM/YYYY
            const parts = game.dateFinished.split("/");
            const year = parts[2] || "N/A";
            yearMap.set(year, (yearMap.get(year) || 0) + 1);
        }
        const gamesPerYear: YearData[] = Array.from(yearMap.entries())
            .map(([year, count]) => ({ year, count }))
            .sort((a, b) => a.year.localeCompare(b.year));

        // ── Gêneros ──────────────────────────────────────────
        const genreMap = new Map<string, number>();
        let totalGenreTags = 0;
        for (const game of games) {
            if (!game.genre) continue;
            const genres = game.genre.split(",").map((g) => g.trim()).filter(Boolean);
            for (const genre of genres) {
                genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
                totalGenreTags++;
            }
        }

        // Top 5 + "Outros"
        const sortedGenres = Array.from(genreMap.entries())
            .sort((a, b) => b[1] - a[1]);

        const top5 = sortedGenres.slice(0, 5);
        const othersCount = sortedGenres.slice(5).reduce((sum, [, v]) => sum + v, 0);

        const genreBreakdown: GenreData[] = top5.map(([name, value]) => ({
            name,
            value,
            percent: totalGenreTags > 0 ? Math.round((value / totalGenreTags) * 100) : 0,
        }));

        if (othersCount > 0) {
            genreBreakdown.push({
                name: "Outros",
                value: othersCount,
                percent: totalGenreTags > 0 ? Math.round((othersCount / totalGenreTags) * 100) : 0,
            });
        }

        const topGenre = sortedGenres.length > 0 ? sortedGenres[0][0] : "—";

        // ── Distribuição de notas ────────────────────────────
        const buckets: RatingBucket[] = [
            { range: "0-2", count: 0 },
            { range: "2-4", count: 0 },
            { range: "4-6", count: 0 },
            { range: "6-8", count: 0 },
            { range: "8-10", count: 0 },
        ];

        for (const game of games) {
            const r = game.rating;
            if (r < 2) buckets[0].count++;
            else if (r < 4) buckets[1].count++;
            else if (r < 6) buckets[2].count++;
            else if (r < 8) buckets[3].count++;
            else buckets[4].count++;
        }

        return {
            totalGames,
            averageRating,
            bestGame: bestGame ? { name: bestGame.name, rating: bestGame.rating } : null,
            topGenre,
            gamesPerYear,
            genreBreakdown,
            ratingDistribution: buckets,
        };
    }, [games]);
};
