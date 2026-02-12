import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Game } from "../types";
import { colors } from "../constant/colors";
import { useGameStats } from "../hooks/useGameStats";

// ─── Cores para o donut de gêneros ──────────────────────────
const GENRE_COLORS = [
    "var(--color-accent)",
    "#6366f1", // indigo
    "#22d3ee", // cyan
    "#f43f5e", // rose
    "#a3e635", // lime
    "#94a3b8", // slate (Outros)
];

// ─── Tooltip customizado ────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div
            className="px-3 py-2 rounded-lg text-xs shadow-lg border"
            style={{
                backgroundColor: "rgba(15, 17, 22, 0.95)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
            }}
        >
            <p className="font-semibold">{label}</p>
            {payload.map((entry: any, i: number) => (
                <p key={i} style={{ color: entry.color }}>
                    {entry.name}: {entry.value}
                </p>
            ))}
        </div>
    );
};

// ─── Stat Card ──────────────────────────────────────────────
const StatCard = ({
    label,
    value,
    sub,
}: {
    label: string;
    value: string | number;
    sub?: string;
}) => (
    <div
        className="flex-1 flex flex-col items-center gap-1 px-3 py-3 rounded-xl border min-w-0"
        style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
        }}
    >
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: colors.textMuted }}>
            {label}
        </p>
        <p className="text-xl font-bold leading-none" style={{ color: colors.accent }}>
            {value}
        </p>
        {sub && (
            <p className="text-[10px] truncate max-w-full" style={{ color: colors.textSecondary }}>
                {sub}
            </p>
        )}
    </div>
);

// ─── StatsPanel ─────────────────────────────────────────────

interface StatsPanelProps {
    games: Game[];
}

export const StatsPanel = ({ games }: StatsPanelProps) => {
    const stats = useGameStats(games);

    if (games.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-sm italic" style={{ color: colors.textDark }}>
                    Adicione jogos para ver suas estatísticas.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">

            {/* ── Stat Cards ─────────────────────────────── */}
            <div className="flex flex-row gap-2.5">
                <StatCard label="Total" value={stats.totalGames} />
                <StatCard label="Nota Média" value={stats.averageRating} />
                <StatCard
                    label="Melhor Nota"
                    value={stats.bestGame ? `★ ${stats.bestGame.rating}` : "—"}
                    sub={stats.bestGame?.name}
                />
                <StatCard label="Top Gênero" value={stats.topGenre} />
            </div>

            {/* ── Jogos por Ano (BarChart) ────────────────── */}
            <div
                className="rounded-xl border p-4"
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
            >
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
                    Jogos Zerados por Ano
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={stats.gamesPerYear} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="year"
                            tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                            axisLine={{ stroke: "var(--color-border)" }}
                            tickLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                        <Bar dataKey="count" name="Jogos" fill="url(#barGradient)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ── Row: Gêneros + Distribuição de Notas ────── */}
            <div className="flex flex-row gap-2.5">

                {/* Donut de Gêneros */}
                <div
                    className="flex-1 rounded-xl border p-4"
                    style={{ backgroundColor: colors.card, borderColor: colors.border }}
                >
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>
                        Gêneros
                    </h3>
                    {stats.genreBreakdown.length === 0 ? (
                        <p className="text-xs italic py-8 text-center" style={{ color: colors.textDark }}>
                            Sem dados de gênero
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={stats.genreBreakdown}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={3}
                                    strokeWidth={0}
                                >
                                    {stats.genreBreakdown.map((_, i) => (
                                        <Cell key={i} fill={GENRE_COLORS[i % GENRE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number | undefined, name: string) => {
                                        const entry = stats.genreBreakdown.find((g) => g.name === name);
                                        return [`${value ?? 0} (${entry?.percent ?? 0}%)`, name];
                                    }}
                                    contentStyle={{
                                        backgroundColor: "rgba(15, 17, 22, 0.95)",
                                        border: `1px solid var(--color-border)`,
                                        borderRadius: "8px",
                                        fontSize: "11px",
                                    }}
                                    itemStyle={{ color: "var(--color-text-primary)" }}
                                    labelStyle={{ color: "var(--color-text-primary)" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                    {/* Legenda compacta */}
                    {stats.genreBreakdown.length > 0 && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            {stats.genreBreakdown.map((g, i) => (
                                <div key={g.name} className="flex items-center gap-1">
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: GENRE_COLORS[i % GENRE_COLORS.length] }}
                                    />
                                    <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                                        {g.name} ({g.percent}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Distribuição de Notas (BarChart horizontal) */}
                <div
                    className="flex-1 rounded-xl border p-4"
                    style={{ backgroundColor: colors.card, borderColor: colors.border }}
                >
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>
                        Distribuição de Notas
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart
                            data={stats.ratingDistribution}
                            layout="vertical"
                            margin={{ top: 5, right: 10, left: -5, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="ratingGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.9} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                type="number"
                                allowDecimals={false}
                                tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="range"
                                tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                width={35}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                            <Bar dataKey="count" name="Jogos" fill="url(#ratingGradient)" radius={[0, 4, 4, 0]} maxBarSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
