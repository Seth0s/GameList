import { useEffect, useState } from "react";
import { Game } from "../types";
import { colors, fallbackImages } from "../constant/colors";
import { useSteamSearch } from "../hooks/useSteamSearch";
import { DatePicker } from "./DatePicker";

interface ModalGameProps {
    isOpen: boolean;
    onClose: () => void;
    onAddGame: (game: Omit<Game, "id">) => void;
}

// Data de hoje formatada como DD/MM/YYYY
const getTodayDate = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
};

export const ModalGame = ({ isOpen, onClose, onAddGame }: ModalGameProps) => {
    // ─── State local do formulário ───────────────────────────
    const [mode, setMode] = useState<"steam" | "manual">("steam");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [bannerImage, setBannerImage] = useState("");
    const [genre, setGenre] = useState("");
    const [rating, setRating] = useState<number>(0);
    const [dateFinished, setDateFinished] = useState(getTodayDate());

    const { query, setQuery, results, isLoading, triggerSearch, selectGame, selectedGame, error: steamError } = useSteamSearch();

    useEffect(() => {
        if (selectedGame) {
            setName(selectedGame.name);
            setImage(selectedGame.image);
            setBannerImage(selectedGame.bannerImage ?? "");
            setGenre(selectedGame.genre ?? "");
        }
    }, [selectedGame]);

    if (!isOpen) return null;

    // Seleciona um jogo da lista de resultados
    const handleSelectGame = (appId: string) => {
        selectGame(appId);
        setQuery(""); // limpa a busca após selecionar
    };

    // Alterna entre modo Steam e Manual
    const handleModeSwitch = (newMode: "steam" | "manual") => {
        setMode(newMode);
        // Limpa campos ao trocar de modo
        setName("");
        setImage("");
        setBannerImage("");
        setGenre("");
        setQuery("");
    };

    // Monta o objeto e passa pro hook via props
    const handleSave = () => {
        if (!name.trim()) return;
        onAddGame({
            name,
            image,
            bannerImage: bannerImage || undefined,
            genre: genre || undefined,
            rating,
            dateFinished,
        });
        // Limpa o formulário para a próxima abertura
        setMode("steam");
        setName("");
        setImage("");
        setBannerImage("");
        setGenre("");
        setRating(0);
        setDateFinished(getTodayDate());
    };

    // Dropdown só aparece quando tem query digitada E resultados
    const showDropdown = query.trim().length > 0 && results.length > 0;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-[420px] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
                    style={{ backgroundColor: "#1e2128" }}
                >

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                        <h1 className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                            Adicionar Novo Jogo
                        </h1>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-full text-sm transition-colors hover:bg-white/10"
                            style={{ color: colors.textMuted }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-4 px-5 py-4">

                        {/* Mode Toggle: Steam / Manual */}
                        <div
                            className="flex rounded-lg border overflow-hidden"
                            style={{ borderColor: colors.border }}
                        >
                            <button
                                onClick={() => handleModeSwitch("steam")}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors"
                                style={{
                                    backgroundColor: mode === "steam" ? colors.accent : "transparent",
                                    color: mode === "steam" ? "#000" : colors.textMuted,
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                                    <path d="M127.8 0C57.7 0 1 55.5 0 125.2l68.6 28.3c5.8-4 12.8-6.3 20.4-6.3l30.6-44.3c0-.3 0-.6 0-.9 0-22.6 18.4-41 41-41s41 18.4 41 41-18.4 41-41 41h-1l-43.6 31.1c0 .5 0 1 0 1.5 0 17-13.8 30.7-30.7 30.7-15 0-27.5-10.8-30.2-25L3.4 155.6C20.1 211.4 72 252 131.6 252c72 0 124.4-58.4 124.4-126.1C256 56.5 198.4 0 127.8 0zM79.6 218.2l-15.6-6.4c2.8 5.8 7.4 10.8 13.6 13.4 13.4 5.6 28.9-.8 34.5-14.2 2.7-6.5 2.7-13.6 0-20.1-2.7-6.5-7.8-11.5-14.3-14.2-6.4-2.6-13.2-2.4-19.2.2l16.1 6.7c9.9 4.1 14.6 15.4 10.5 25.3-4.1 9.9-15.4 14.6-25.6 9.3zm101-116.2c0-15.1-12.3-27.3-27.3-27.3-15.1 0-27.3 12.2-27.3 27.3 0 15.1 12.2 27.3 27.3 27.3 15 0 27.3-12.2 27.3-27.3z"/>
                                </svg>
                                Steam
                            </button>
                            <button
                                onClick={() => handleModeSwitch("manual")}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors"
                                style={{
                                    backgroundColor: mode === "manual" ? colors.accent : "transparent",
                                    color: mode === "manual" ? "#000" : colors.textMuted,
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Manual
                            </button>
                        </div>

                        {/* Steam Mode: Search Input + Dropdown */}
                        {mode === "steam" && (
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: colors.textMuted }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar na Steam..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            triggerSearch();
                                        }
                                    }}
                                    className="w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-white/15 placeholder:text-slate-500"
                                    style={{
                                        backgroundColor: "#282c34",
                                        borderColor: colors.border,
                                        color: colors.textPrimary,
                                    }}
                                />

                                {/* Search Results Dropdown */}
                                {showDropdown && (
                                    <div
                                        className="absolute left-0 right-0 top-full mt-1 rounded-lg border overflow-hidden max-h-[160px] overflow-y-auto z-10"
                                        style={{
                                            backgroundColor: "#282c34",
                                            borderColor: colors.border,
                                        }}
                                    >
                                        {results.map((game) => (
                                            <div
                                                key={game.id}
                                                onClick={() => handleSelectGame(game.id)}
                                                className="flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors hover:bg-white/5"
                                            >
                                                <div className="shrink-0 w-8 h-8 rounded overflow-hidden bg-white/5">
                                                    <img className="w-full h-full object-cover" src={game.image} alt={game.name} />
                                                </div>
                                                <span className="text-sm truncate" style={{ color: colors.textPrimary }}>{game.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Loading indicator */}
                                {isLoading && query.trim().length > 0 && (
                                    <div
                                        className="absolute left-0 right-0 top-full mt-1 rounded-lg border px-3 py-3 text-sm text-center"
                                        style={{
                                            backgroundColor: "#282c34",
                                            borderColor: colors.border,
                                            color: colors.textMuted,
                                        }}
                                    >
                                        Buscando...
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Manual Mode: Nome do jogo */}
                        {mode === "manual" && (
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: colors.textMuted }}>🎮</span>
                                <input
                                    type="text"
                                    placeholder="Nome do jogo..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-white/15 placeholder:text-slate-500"
                                    style={{
                                        backgroundColor: "#282c34",
                                        borderColor: colors.border,
                                        color: colors.textPrimary,
                                    }}
                                />
                            </div>
                        )}

                        {/* Game Preview */}
                        <div
                            className="flex items-center gap-4 p-3 rounded-xl border"
                            style={{
                                backgroundColor: "#282c34",
                                borderColor: colors.border,
                            }}
                        >
                            <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white/5">
                                <img
                                    className="w-full h-full object-contain"
                                    src={image || fallbackImages.cover}
                                    alt={name || "Game"}
                                    onError={(e) => {
                                        if (e.currentTarget.src !== fallbackImages.cover) {
                                            e.currentTarget.src = fallbackImages.cover;
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 min-w-0">
                                <h2 className="text-sm font-semibold truncate" style={{ color: colors.textPrimary }}>
                                    {name || "Digite o nome do jogo"}
                                </h2>
                                {/* Aviso quando detalhes não foram carregados */}
                                {steamError && mode === "steam" && (
                                    <p className="text-[11px] leading-tight" style={{ color: "#ef4444" }}>
                                        ⚠ {steamError}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Rating + Date Row */}
                        <div className="flex flex-row gap-3">
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: colors.accent }}>★</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    placeholder="9.5"
                                    value={rating || ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "") { setRating(0); return; }
                                        const num = parseFloat(val);
                                        if (isNaN(num)) return;
                                        setRating(Math.min(10, Math.max(0, num)));
                                    }}
                                    className="w-full pl-8 pr-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-white/15 placeholder:text-slate-500"
                                    style={{
                                        backgroundColor: "#282c34",
                                        borderColor: colors.border,
                                        color: colors.textPrimary,
                                    }}
                                />
                            </div>
                            <DatePicker value={dateFinished} onChange={setDateFinished} />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-row gap-3 px-5 py-4 border-t border-white/5">
                        <button
                            onClick={handleSave}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                            ✓ Salvar Jogo
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
                            style={{
                                borderColor: colors.border,
                                color: colors.textSecondary,
                            }}
                        >
                            Cancelar
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}
