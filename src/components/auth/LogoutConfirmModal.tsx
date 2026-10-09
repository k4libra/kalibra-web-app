
interface LogoutConfirmModalProps {
    isOpen: boolean;
    loading?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
}

export default function LogoutConfirmModal({
                                               isOpen,
                                               loading = false,
                                               onConfirm,
                                               onCancel,
                                           }: LogoutConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(16, 24, 40, 0.42)" }}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="logout-title"
                aria-describedby="logout-description"
                className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl"
                style={{
                    maxWidth: "420px",
                    borderRadius: "16px",
                    padding: "24px",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 16px 40px rgba(16, 24, 40, 0.18)",
                }}
            >
                <div className="flex items-start gap-4">
                    <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{
                            width: "44px",
                            height: "44px",
                            minWidth: "44px",
                            borderRadius: "12px",
                            backgroundColor: "#FEE4E2",
                            color: "#D92D20",
                        }}
                    >
                        <svg
                            width="23"
                            height="23"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M10 17l5-5-5-5" />
                            <path d="M15 12H3" />
                            <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                        </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <h2
                                id="logout-title"
                                className="font-semibold text-gray-900"
                                style={{
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    lineHeight: "26px",
                                    color: "#101828",
                                }}
                            >
                                ¿Deseas cerrar sesión?
                            </h2>

                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={loading}
                                aria-label="Cerrar ventana"
                                className="shrink-0 transition hover:opacity-70 disabled:opacity-50"
                                style={{
                                    color: "#344054",
                                    background: "transparent",
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    padding: "2px",
                                }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    aria-hidden="true"
                                >
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <p
                            id="logout-description"
                            className="mt-1"
                            style={{
                                fontSize: "13px",
                                lineHeight: "19px",
                                color: "#475467",
                                marginTop: "4px",
                            }}
                        >
                            Tu sesión se cerrará en este dispositivo.
                            Tus cursos y el progreso de tus estudiantes
                            se mantienen guardados.
                        </p>
                    </div>
                </div>

                <div
                    className="mt-5 flex flex-wrap justify-end gap-3"
                    style={{ marginTop: "18px" }}
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="transition hover:opacity-85 disabled:opacity-50"
                        style={{
                            padding: "11px 18px",
                            borderRadius: "12px",
                            backgroundColor: "#EEF2FF",
                            color: "#101828",
                            fontSize: "13px",
                            fontWeight: 600,
                            border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={() => void onConfirm()}
                        disabled={loading}
                        className="flex items-center gap-2 transition hover:opacity-90 disabled:opacity-50"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "11px 16px",
                            borderRadius: "12px",
                            backgroundColor: "#C9161D",
                            color: "#FFFFFF",
                            fontSize: "13px",
                            fontWeight: 600,
                            border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M10 17l5-5-5-5" />
                            <path d="M15 12H3" />
                            <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                        </svg>

                        {loading ? "Cerrando..." : "Sí, cerrar sesión"}
                    </button>
                </div>
            </div>
        </div>
    );
}
