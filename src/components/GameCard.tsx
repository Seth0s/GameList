import { Game } from "../types";
import { colors } from "../constant/colors";

interface GameCardProps {
    game: Game;
    isDeleteMode: boolean;
    onDelete: (id: string) => void;
}

export const GameCard = ({ game, isDeleteMode, onDelete }: GameCardProps) => {
    return (
    <div
        className="flex flex-row items-center gap-3 rounded-xl px-3.5 py-2.5 min-h-[68px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
        style={{
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
        }}
        onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = colors.cardHover;
            e.currentTarget.style.borderColor = colors.borderHover;
        }}
        onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = colors.card;
            e.currentTarget.style.borderColor = colors.border;
        }}
    >
        <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white/5">
            <img className="w-full h-full object-cover" src={game.image} alt={game.name} />
        </div>
        <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate leading-tight" style={{ color: colors.textPrimary }}>{game.name}</h1>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
            <p className="text-sm font-bold whitespace-nowrap" style={{ color: colors.accent }}>★ {game.rating}</p>
            <p className="text-xs whitespace-nowrap" style={{ color: colors.textMuted }}>📅 {game.dateFinished}</p>
        </div>
        {isDeleteMode && (
            <button
                onClick={() => onDelete(game.id)}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs transition-colors bg-red-500/20 text-red-400 hover:bg-red-500/40"
            >
                ✕
            </button>
        )}
    </div>
    );
};