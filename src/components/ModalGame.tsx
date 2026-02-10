import { useEffect, useState } from "react";
import { Game } from "../types";
import { colors } from "../constant/colors";
import { useSteamSearch } from "../hooks/useSteamSearch";

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
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [bannerImage, setBannerImage] = useState("");
    const [rating, setRating] = useState<number>(0);
    const [dateFinished, setDateFinished] = useState(getTodayDate());

    
    const { query, setQuery, results, isLoading, triggerSearch, selectGame, selectedGame } = useSteamSearch();

    
    useEffect(() => {
        if (selectedGame) {
            setName(selectedGame.name);
            setImage(selectedGame.image);
            setBannerImage(selectedGame.bannerImage ?? "");
        }
    }, [selectedGame]);

    if (!isOpen) return null;

    // Seleciona um jogo da lista de resultados
    const handleSelectGame = (appId: string) => {
        selectGame(appId);
        setQuery(""); // limpa a busca após selecionar
    };

    // Monta o objeto e passa pro hook via props
    const handleSave = () => {
        if (!name.trim()) return;
        onAddGame({
            name,
            image,
            bannerImage: bannerImage || undefined,
            rating,
            dateFinished,
        });
        // Limpa o formulário para a próxima abertura
        setName("");
        setImage("");
        setBannerImage("");
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

                        {/* Search Input + Dropdown */}
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: colors.textMuted }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar na Steam ou digitar nome..."
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

                        {/* Game Preview */}
                        <div
                            className="flex items-center gap-4 p-3 rounded-xl border"
                            style={{
                                backgroundColor: "#282c34",
                                borderColor: colors.border,
                            }}
                        >
                            <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white/5">
                                {image ? (
                                    <img className="w-full h-full object-contain" src={image} alt={name} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl" style={{ color: colors.textDark }}>🎮</div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5 min-w-0">
                                <h2 className="text-sm font-semibold truncate" style={{ color: colors.textPrimary }}>
                                    {name || "Selecione um jogo"}
                                </h2>
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
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: colors.textMuted }}>📅</span>
                                <input
                                    type="text"
                                    placeholder="25/02/2026"
                                    value={dateFinished}
                                    onChange={(e) => setDateFinished(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-white/15 placeholder:text-slate-500"
                                    style={{
                                        backgroundColor: "#282c34",
                                        borderColor: colors.border,
                                        color: colors.textPrimary,
                                    }}
                                />
                            </div>
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
