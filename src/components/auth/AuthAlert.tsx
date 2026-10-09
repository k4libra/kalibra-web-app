
import type { ReactNode } from "react";

type AlertType = "error" | "success" | "info";

interface AuthAlertProps {
    type?: AlertType;
    message: string;
    onClose?: () => void;
    children?: ReactNode;
}

const alertStyles = {
    error: {
        container: "border-red-200 bg-red-50 text-red-800",
        icon: "text-red-600",
    },
    success: {
        container: "border-green-200 bg-green-50 text-green-800",
        icon: "text-green-600",
    },
    info: {
        container: "border-blue-200 bg-blue-50 text-blue-800",
        icon: "text-blue-600",
    },
};

export default function AuthAlert({
                                      type = "error",
                                      message,
                                      onClose,
                                      children,
                                  }: AuthAlertProps) {
    const styles = alertStyles[type];

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            className={`flex items-start gap-3 rounded-lg border p-4 ${styles.container}`}
        >
            <div className={`mt-0.5 shrink-0 ${styles.icon}`}>
                {type === "success" ? (
                    <span aria-hidden="true">✓</span>
                ) : type === "info" ? (
                    <span aria-hidden="true">ⓘ</span>
                ) : (
                    <span aria-hidden="true">!</span>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{message}</p>

                {children && (
                    <div className="mt-2 text-sm">
                        {children}
                    </div>
                )}
            </div>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar aviso"
                    className="shrink-0 rounded p-1 transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
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
            )}
        </div>
    );
}
