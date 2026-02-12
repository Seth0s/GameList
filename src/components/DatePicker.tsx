import { useState, useRef, useEffect } from "react";
import { colors } from "../constant/colors";

interface DatePickerProps {
    value: string; // DD/MM/YYYY
    onChange: (date: string) => void;
}

const MONTHS_SHORT = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const WEEKDAYS_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"];

/** Converte DD/MM/YYYY → { day, month (0-based), year } */
const parseDate = (str: string) => {
    const [d, m, y] = str.split("/").map(Number);
    if (!d || !m || !y) {
        const today = new Date();
        return { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() };
    }
    return { day: d, month: m - 1, year: y };
};

/** Formata para DD/MM/YYYY */
const formatDate = (day: number, month: number, year: number): string => {
    return `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;
};

/** Retorna quantos dias tem o mês */
const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

/** Retorna o dia da semana do primeiro dia do mês (0 = Dom) */
const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

export const DatePicker = ({ value, onChange }: DatePickerProps) => {
    const parsed = parseDate(value);
    const [isOpen, setIsOpen] = useState(false);
    const [viewMonth, setViewMonth] = useState(parsed.month);
    const [viewYear, setViewYear] = useState(parsed.year);
    const [selectedDay, setSelectedDay] = useState(parsed.day);
    const [showYearGrid, setShowYearGrid] = useState(false);

    const pickerRef = useRef<HTMLDivElement>(null);

    // Fecha ao clicar fora
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setShowYearGrid(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    const handleDayClick = (day: number) => {
        setSelectedDay(day);
        onChange(formatDate(day, viewMonth, viewYear));
        setIsOpen(false);
        setShowYearGrid(false);
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
        else setViewMonth((m) => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
        else setViewMonth((m) => m + 1);
    };

    const handleYearSelect = (year: number) => {
        setViewYear(year);
        setShowYearGrid(false);
    };

    // Grid do calendário
    const totalDays = daysInMonth(viewMonth, viewYear);
    const startDay = firstDayOfMonth(viewMonth, viewYear);
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);

    // Anos disponíveis
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = currentYear - 10; y <= currentYear + 1; y++) years.push(y);

    const isSelected = (day: number) =>
        day === selectedDay && viewMonth === parsed.month && viewYear === parsed.year;

    const isToday = (day: number) => {
        const now = new Date();
        return day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();
    };

    return (
        <div className="flex-1 relative" ref={pickerRef}>
            {/* Input */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: colors.textMuted }}>📅</span>
            <input
                type="text"
                readOnly
                value={value}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none transition-colors cursor-pointer focus:border-white/15 placeholder:text-slate-500"
                style={{
                    backgroundColor: "#282c34",
                    borderColor: colors.border,
                    color: colors.textPrimary,
                }}
            />

            {/* Calendário — mesmo tamanho do input (w-full), flutuante acima */}
            {isOpen && (
                <div
                    className="absolute left-0 right-0 bottom-full mb-1.5 rounded-lg border shadow-2xl shadow-black/60 z-50 overflow-hidden"
                    style={{
                        backgroundColor: "#1e2128",
                        borderColor: colors.border,
                    }}
                >
                    {/* Header — mês/ano + setas */}
                    <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/5">
                        <button
                            onClick={prevMonth}
                            className="w-5 h-5 flex items-center justify-center rounded transition-colors hover:bg-white/10"
                            style={{ color: colors.textSecondary }}
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        <button
                            onClick={() => setShowYearGrid(!showYearGrid)}
                            className="text-[11px] font-semibold px-1 py-0.5 rounded transition-colors hover:bg-white/10"
                            style={{ color: colors.textPrimary }}
                        >
                            {MONTHS_SHORT[viewMonth]} {viewYear}
                        </button>

                        <button
                            onClick={nextMonth}
                            className="w-5 h-5 flex items-center justify-center rounded transition-colors hover:bg-white/10"
                            style={{ color: colors.textSecondary }}
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>

                    {/* Grid de anos */}
                    {showYearGrid && (
                        <div className="grid grid-cols-3 gap-0.5 p-1.5">
                            {years.map((y) => (
                                <button
                                    key={y}
                                    onClick={() => handleYearSelect(y)}
                                    className={`py-1 rounded text-[10px] font-medium transition-colors ${
                                        y === viewYear ? "" : "hover:bg-white/5"
                                    }`}
                                    style={{
                                        backgroundColor: y === viewYear ? colors.accent : "transparent",
                                        color: y === viewYear ? "#000" : colors.textSecondary,
                                    }}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Dias */}
                    {!showYearGrid && (
                        <div className="px-1.5 pt-1.5 pb-1.5">
                            {/* Dias da semana */}
                            <div className="grid grid-cols-7 mb-0.5">
                                {WEEKDAYS_SHORT.map((wd, i) => (
                                    <div
                                        key={i}
                                        className="text-center text-[8px] font-bold uppercase leading-tight py-0.5"
                                        style={{ color: colors.textDark }}
                                    >
                                        {wd}
                                    </div>
                                ))}
                            </div>

                            {/* Dias do mês */}
                            <div className="grid grid-cols-7">
                                {cells.map((day, i) => (
                                    <div key={i} className="flex items-center justify-center">
                                        {day ? (
                                            <button
                                                onClick={() => handleDayClick(day)}
                                                className={`w-full aspect-square rounded text-[10px] font-medium transition-all border ${
                                                    isSelected(day)
                                                        ? "scale-105 border-transparent"
                                                        : isToday(day)
                                                        ? "ring-1 border-transparent"
                                                        : "border-transparent hover:border-current"
                                                }`}
                                                style={{
                                                    backgroundColor: isSelected(day) ? colors.accent : "transparent",
                                                    color: isSelected(day) ? "#000" : colors.textPrimary,
                                                    // @ts-expect-error Tailwind ring + hover border color
                                                    "--tw-ring-color": isToday(day) && !isSelected(day) ? colors.accent : undefined,
                                                    "--hover-border": colors.accent,
                                                }}
                                                onMouseEnter={(e) => { if (!isSelected(day)) e.currentTarget.style.borderColor = colors.accent; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
                                            >
                                                {day}
                                            </button>
                                        ) : (
                                            <span className="w-full aspect-square" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
