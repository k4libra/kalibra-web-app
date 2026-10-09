
import { useState } from "react";

import { authService } from "../services/auth.service";

import type {
    AuthResponse,
    RegisterRequest,
} from "../types/auth";

interface UseRegisterReturn {
    register: (data: RegisterRequest) => Promise<AuthResponse | null>;
    loading: boolean;
    error: string;
    success: boolean;
    clearError: () => void;
    reset: () => void;
}

export function useRegister(): UseRegisterReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const register = async (
        data: RegisterRequest
    ): Promise<AuthResponse | null> => {
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await authService.register(data);

            setSuccess(true);

            return response;
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al registrar la cuenta.";

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
        register,
        loading,
        error,
        success,
        clearError,
        reset,
    };
}
