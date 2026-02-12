import { useCallback, useRef } from "react";
import ColorThief from "colorthief";
import { defaultPalette } from "../constant/colors";

// ─── Tipos ──────────────────────────────────────────────────
type RGB = [number, number, number];

// ─── Helpers de cor ─────────────────────────────────────────

/** RGB → hex string */
const rgbToHex = ([r, g, b]: RGB): string =>
    `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;

/** Escurece uma cor RGB pelo fator (0 = preto, 1 = original) */
const darken = ([r, g, b]: RGB, factor: number): RGB => [
    Math.round(r * factor),
    Math.round(g * factor),
    Math.round(b * factor),
];

/** Clareia uma cor RGB misturando com branco */
const lighten = ([r, g, b]: RGB, factor: number): RGB => [
    Math.round(r + (255 - r) * factor),
    Math.round(g + (255 - g) * factor),
    Math.round(b + (255 - b) * factor),
];

/** RGB com alpha → rgba string */
const rgba = ([r, g, b]: RGB, alpha: number): string =>
    `rgba(${r}, ${g}, ${b}, ${alpha})`;

/** Calcula luminância relativa (0 = escuro, 1 = claro) */
const luminance = ([r, g, b]: RGB): number =>
    (0.299 * r + 0.587 * g + 0.114 * b) / 255;

/** Encontra a cor mais vibrante (maior saturação) de uma paleta */
const mostVibrant = (palette: RGB[]): RGB => {
    let best = palette[0];
    let bestSat = 0;

    for (const color of palette) {
        const max = Math.max(...color);
        const min = Math.min(...color);
        const sat = max === 0 ? 0 : (max - min) / max;
        if (sat > bestSat) {
            bestSat = sat;
            best = color;
        }
    }
    return best;
};

// ─── Mapeamento: paleta extraída → tema da UI ───────────────

const buildThemeFromPalette = (dominant: RGB, palette: RGB[]) => {
    const accent = mostVibrant(palette);
    const base = darken(dominant, 0.25); // escurece bastante para fundo

    // Se a cor dominante for muito clara, escurece mais
    const lum = luminance(dominant);
    const bgFactor = lum > 0.5 ? 0.15 : 0.25;
    const bgColor = darken(dominant, bgFactor);

    return {
        "--color-bg": rgba(bgColor, 0.65),
        "--color-surface": rgba(bgColor, 0.88),
        "--color-card": rgbToHex(darken(base, 0.85)),
        "--color-card-hover": rgbToHex(darken(base, 1.1)),
        "--color-border": rgba(lighten(accent, 0.3), 0.08),
        "--color-border-hover": rgba(accent, 0.2),
        "--color-text-primary": "#e2e8f0",
        "--color-text-secondary": rgbToHex(lighten(dominant, 0.45)),
        "--color-text-muted": rgbToHex(lighten(dominant, 0.25)),
        "--color-text-dark": rgbToHex(lighten(base, 0.2)),
        "--color-accent": rgbToHex(accent),
    };
};

// ─── Hook ───────────────────────────────────────────────────

export const useAdaptiveTheme = () => {
    const colorThief = useRef(new ColorThief());
    const activeGameId = useRef<string | null>(null);

    /** Aplica um mapa de CSS variables no :root */
    const applyVars = useCallback((vars: Record<string, string>) => {
        const root = document.documentElement;
        for (const [key, value] of Object.entries(vars)) {
            root.style.setProperty(key, value);
        }
    }, []);

    /** Reseta para a paleta padrão */
    const resetTheme = useCallback(() => {
        activeGameId.current = null;
        applyVars({
            "--color-bg": defaultPalette.bg,
            "--color-surface": defaultPalette.surface,
            "--color-card": defaultPalette.card,
            "--color-card-hover": defaultPalette.cardHover,
            "--color-border": defaultPalette.border,
            "--color-border-hover": defaultPalette.borderHover,
            "--color-text-primary": defaultPalette.textPrimary,
            "--color-text-secondary": defaultPalette.textSecondary,
            "--color-text-muted": defaultPalette.textMuted,
            "--color-text-dark": defaultPalette.textDark,
            "--color-accent": defaultPalette.accent,
        });
    }, [applyVars]);

    /** Extrai cores de uma imagem e aplica o tema */
    const applyTheme = useCallback((gameId: string, imageUrl: string) => {
        // Toggle: se clicar no mesmo jogo, reseta
        if (activeGameId.current === gameId) {
            resetTheme();
            return;
        }

        activeGameId.current = gameId;

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            try {
                const dominant = colorThief.current.getColor(img) as RGB;
                const palette = colorThief.current.getPalette(img, 6) as RGB[];
                const theme = buildThemeFromPalette(dominant, palette);
                applyVars(theme);
            } catch (err) {
                console.warn("[AdaptiveTheme] Falha ao extrair cores:", err);
            }
        };

        img.onerror = () => {
            console.warn("[AdaptiveTheme] Falha ao carregar imagem:", imageUrl);
        };

        img.src = imageUrl;
    }, [applyVars, resetTheme]);

    return { applyTheme, resetTheme, activeGameId };
};
