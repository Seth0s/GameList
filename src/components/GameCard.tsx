import { Game } from "../types";
import { colors, fallbackImages } from "../constant/colors";

interface GameCardProps {
    game: Game;
    isDeleteMode: boolean;
    isActive?: boolean;
    onDelete: (id: string) => void;
    onSelect?: (gameId: string, imageUrl: string) => void;
}

export const GameCard = ({ game, isDeleteMode, isActive, onDelete, onSelect }: GameCardProps) => {
    const handleClick = () => {
        if (isDeleteMode) return;
        const imageUrl = game.bannerImage || game.image;
        if (imageUrl && onSelect) onSelect(game.id, imageUrl);
    };

    return (
    <div
        className={`relative rounded-xl min-h-[76px] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 cursor-pointer ${
            isActive ? "ring-2" : ""
        }`}
        style={{
            backgroundColor: colors.card,
            border: `1px solid ${isActive ? colors.accent : colors.border}`,
            // @ts-expect-error Tailwind ring utility
            "--tw-ring-color": isActive ? colors.accent : "transparent",
        }}
        onClick={handleClick}
        onMouseEnter={e => {
            e.currentTarget.style.borderColor = isActive ? colors.accent : colors.borderHover;
        }}
        onMouseLeave={e => {
            e.currentTarget.style.borderColor = isActive ? colors.accent : colors.border;
        }}
    >
        {/* Banner de fundo */}
        <>
            <img
                className="absolute inset-0 w-full h-full object-cover opacity-15"
                src={game.bannerImage || fallbackImages.banner}
                alt=""
                aria-hidden="true"
                onError={(e) => {
                    if (e.currentTarget.src !== fallbackImages.banner) {
                        e.currentTarget.src = fallbackImages.banner;
                    }
                }}
            />
            {/* Gradiente escuro sobre o banner */}
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/60" />
        </>

        {/* Conteúdo sobre o banner */}
        <div className="relative z-10 flex flex-row items-center gap-3 px-3.5 py-2.5">
            {/* Capa vertical */}
            <div className="shrink-0 w-[48px] h-[64px] rounded-lg overflow-hidden bg-white/5 shadow-md shadow-black/30">
                <img
                    className="w-full h-full object-cover"
                    src={game.image || fallbackImages.cover}
                    alt={game.name}
                    onError={(e) => {
                        if (e.currentTarget.src !== fallbackImages.cover) {
                            e.currentTarget.src = fallbackImages.cover;
                        }
                    }}
                />
            </div>

            {/* Nome */}
            <div className="flex-1 min-w-0">
                <h1 className="text-sm font-semibold truncate leading-tight" style={{ color: colors.textPrimary }}>
                    {game.name}
                </h1>
            </div>

            {/* Rating + Data */}
            <div className="flex flex-col items-end gap-0.5 shrink-0">
                <p className="text-sm font-bold whitespace-nowrap" style={{ color: colors.accent }}>★ {game.rating}</p>
                <p className="text-xs whitespace-nowrap" style={{ color: colors.textMuted }}>📅 {game.dateFinished}</p>
            </div>

            {/* Botão excluir */}
            {isDeleteMode && (
                <button
                    onClick={() => onDelete(game.id)}
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs transition-colors bg-red-500/20 text-red-400 hover:bg-red-500/40"
                >
                    ✕
                </button>
            )}
        </div>
    </div>
    );
};
