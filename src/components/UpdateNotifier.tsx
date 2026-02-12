import { useEffect, useState } from "react";
import { colors } from "../constant/colors";

type UpdateStatus = "idle" | "checking" | "available" | "downloading" | "downloaded" | "error";

export const UpdateNotifier = () => {
    const [status, setStatus] = useState<UpdateStatus>("idle");
    const [version, setVersion] = useState("");
    const [progress, setProgress] = useState(0);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (!window.updaterAPI) return;

        window.updaterAPI.onStatus((s, data) => {
            switch (s) {
                case "checking":
                    setStatus("checking");
                    break;
                case "available":
                    setStatus("available");
                    setVersion(data ?? "");
                    setDismissed(false);
                    break;
                case "not-available":
                    setStatus("idle");
                    break;
                case "downloading":
                    setStatus("downloading");
                    setProgress(Math.round(data ?? 0));
                    break;
                case "downloaded":
                    setStatus("downloaded");
                    setVersion(data ?? "");
                    setDismissed(false);
                    break;
                case "error":
                    setStatus("error");
                    break;
            }
        });
    }, []);

    if (dismissed || status === "idle" || status === "checking") return null;

    return (
        <div
            className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm transition-all animate-in"
            style={{
                backgroundColor: "rgba(15, 17, 22, 0.92)",
                border: `1px solid ${colors.border}`,
                maxWidth: "360px",
            }}
        >
            {/* Ícone */}
            <div className="shrink-0">
                {status === "downloading" ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2">
                        <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83" />
                    </svg>
                ) : status === "downloaded" ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l0 14m0 0l-4-4m4 4l4-4" />
                        <path d="M4 18h16v2H4z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4m0 4h.01" />
                    </svg>
                )}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
                {status === "available" && (
                    <p className="text-xs" style={{ color: colors.textPrimary }}>
                        Nova versão <span className="font-bold" style={{ color: colors.accent }}>{version}</span> disponível. Baixando...
                    </p>
                )}

                {status === "downloading" && (
                    <div>
                        <p className="text-xs mb-1" style={{ color: colors.textPrimary }}>
                            Baixando atualização... {progress}%
                        </p>
                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{ width: `${progress}%`, backgroundColor: colors.accent }}
                            />
                        </div>
                    </div>
                )}

                {status === "downloaded" && (
                    <p className="text-xs" style={{ color: colors.textPrimary }}>
                        Versão <span className="font-bold" style={{ color: "#22c55e" }}>{version}</span> pronta!
                    </p>
                )}

                {status === "error" && (
                    <p className="text-xs" style={{ color: "#ef4444" }}>
                        Erro ao verificar atualizações.
                    </p>
                )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 shrink-0">
                {status === "downloaded" && (
                    <button
                        onClick={() => window.updaterAPI.install()}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors hover:opacity-90"
                        style={{ backgroundColor: "#22c55e", color: "#000" }}
                    >
                        Reiniciar
                    </button>
                )}

                <button
                    onClick={() => setDismissed(true)}
                    className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                    style={{ color: colors.textSecondary }}
                >
                    ✕
                </button>
            </div>
        </div>
    );
};
