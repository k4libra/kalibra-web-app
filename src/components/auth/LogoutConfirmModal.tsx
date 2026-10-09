
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/40 p-4">
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="logout-title"
                aria-describedby="logout-description"
                className="w-full max-w-[360px] rounded-xl bg-white p-5 shadow-xl"
            >
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <svg
                            width="20"
                            height="20"
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
                        <div className="flex items-start justify-between gap-2">
                            <h2
                                id="logout-title"
                                className="text-sm font-semibold text-gray-900"
                            >
                                ¿Deseas cerrar sesión?
                            </h2>

                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={loading}
                                aria-label="Cerrar ventana"
                                className="text-gray-400 transition hover:text-gray-700 disabled:opacity-50"
                            >
                                <svg
                                    width="16"
                                    height="16"
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
                            className="mt-1 text-xs leading-relaxed text-gray-500"
                        >
                            Tu sesión se cerrará en este dispositivo.
                            Tus cursos y el progreso de tus estudiantes
                            se mantienen guardados.
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg bg-indigo-50 px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-indigo-100 disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={() => void onConfirm()}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        <span aria-hidden="true">⇥</span>
                        {loading ? "Cerrando..." : "Sí, cerrar sesión"}
                    </button>
                </div>
            </div>
        </div>
    );
}
