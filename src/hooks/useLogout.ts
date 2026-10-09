
import { useState } from "react";

import { authService } from "../services/auth.service";

interface UseLogoutReturn {
    logout: () => Promise<boolean>;
    loading: boolean;
    error: string;
    clearError: () => void;
}

export function useLogout(): UseLogoutReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const logout = async (): Promise<boolean> => {
        setLoading(true);
        setError("");

        try {
            await authService.logout();

            return true;
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al cerrar sesión.";

            setError(message);

            return false;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError("");
    };

    return {
        logout,
        loading,
        error,
        clearError,
    };
}
