
import { useState } from "react";

import { authService } from "../services/auth.service";

import type {
    AuthResponse,
    LoginRequest,
} from "../types/auth";

interface UseLoginReturn {
    login: (data: LoginRequest) => Promise<AuthResponse | null>;
    loading: boolean;
    error: string;
    success: boolean;
    clearError: () => void;
    reset: () => void;
}

export function useLogin(): UseLoginReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const login = async (
        data: LoginRequest
    ): Promise<AuthResponse | null> => {
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await authService.login(data);

            setSuccess(true);

            return response;
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al iniciar sesión.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError("");
    };

    const reset = () => {
        setError("");
        setSuccess(false);
        setLoading(false);
    };

    return {
        login,
        loading,
        error,
        success,
        clearError,
        reset,
    };
}
