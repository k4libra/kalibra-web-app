
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";

import {
    AuthLayout,
    AuthForm,
} from "../components/auth";

import { useLogin } from "../hooks/useLogin";
import { ROUTES } from "../navigation/routes";

interface LoginErrors {
    email?: string;
    password?: string;
}

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState<LoginErrors>({});

    const {
        login,
        loading,
        error,
        success,
        clearError,
        reset,
    } = useLogin();

    const validateForm = (): boolean => {
        const newErrors: LoginErrors = {};

        if (!email.trim()) {
            newErrors.email =
                "El correo electrónico es obligatorio.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            newErrors.email =
                "Ingresa un correo electrónico válido.";
        }

        if (!password) {
            newErrors.password =
                "La contraseña es obligatoria.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        reset();

        if (!validateForm()) {
            return;
        }

        const response = await login({
            email: email.trim().toLowerCase(),
            password,
        });

        if (response) {
            setPassword("");

            // Navegación de prueba al panel docente.
            // No se almacena el token ficticio.
            navigate(ROUTES.courses, { replace: true });
        }
    };

    return (
        <AuthLayout
            title="Bienvenido a Kalibra"
            description="Acompaña el aprendizaje de tus estudiantes, identifica sus dificultades y gestiona tus cursos desde un solo lugar."
        >
            <AuthForm
                mode="login"
                email={email}
                password={password}
                onEmailChange={(value) => {
                    setEmail(value);

                    setErrors((previous) => ({
                        ...previous,
                        email: undefined,
                    }));

                    clearError();
                }}
                onPasswordChange={(value) => {
                    setPassword(value);

                    setErrors((previous) => ({
                        ...previous,
                        password: undefined,
                    }));

                    clearError();
                }}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                success={
                    success
                        ? "Inicio de sesión de prueba exitoso."
                        : undefined
                }
                onDismissAlert={reset}
                emailError={errors.email}
                passwordError={errors.password}
                footer={
                    <p>
                        ¿Todavía no tienes una cuenta?{" "}
                        <a
                            href="/registro"
                            className="font-semibold text-indigo-600 hover:underline"
                        >
                            Crear cuenta
                        </a>
                    </p>
                }
            />
        </AuthLayout>
    );
}
