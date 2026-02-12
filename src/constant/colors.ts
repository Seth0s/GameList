// Imagens fallback quando a Steam API não retorna imagem
export const fallbackImages = {
  cover: "/icon.png",           // capa pequena — ícone do app
  banner: "/fallback-banner.png", // banner de fundo
};

// ─── Paleta padrão (valores base) ────────────────────────────
// Usados como fallback das CSS variables e para reset do tema.
export const defaultPalette = {
  bg: "rgba(30, 34, 42, 0.65)",
  surface: "rgba(30, 34, 42, 0.88)",
  card: "#1a1d24",
  cardHover: "#22262e",
  border: "rgba(255, 255, 255, 0.06)",
  borderHover: "rgba(245, 166, 35, 0.15)",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  textDark: "#475569",
  accent: "#f5a623",
};

// ─── Cores dinâmicas via CSS variables ───────────────────────
// Os componentes usam este objeto. Os valores apontam para CSS
// custom properties que podem ser atualizadas em tempo real pelo
// hook useAdaptiveTheme, com transição suave via CSS.
export const colors = {
  bg:            "var(--color-bg)",
  surface:       "var(--color-surface)",
  card:          "var(--color-card)",
  cardHover:     "var(--color-card-hover)",
  border:        "var(--color-border)",
  borderHover:   "var(--color-border-hover)",
  textPrimary:   "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
  textMuted:     "var(--color-text-muted)",
  textDark:      "var(--color-text-dark)",
  accent:        "var(--color-accent)",
};
