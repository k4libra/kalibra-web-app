
import { useState } from "react";
import type { FormEvent } from "react";

import {
    AuthLayout,
    AuthForm,
} from "../components/auth";

interface LoginErrors {
    email?: string;
    password?: string;
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState<LoginErrors>({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: LoginErrors = {};

        if (!email.trim()) {
            newErrors.email = "El correo electrónico es obligatorio.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            newErrors.email = "Ingresa un correo electrónico válido.";
        }

        if (!password) {
            newErrors.password = "La contraseña es obligatoria.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // Simulación temporal:
        // Hasta conectar la API no se autentica ningún usuario.
        setError(
            "No se pudo iniciar sesión. El servicio de autenticación aún no está conectado."
        );

        setLoading(false);
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
                    setError("");
                }}
                onPasswordChange={(value) => {
                    setPassword(value);
                    setErrors((previous) => ({
                        ...previous,
                        password: undefined,
                    }));
                    setError("");
                }}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                onDismissAlert={() => setError("")}
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
