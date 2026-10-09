
import { useState } from "react";
import type { FormEvent } from "react";

import {
    AuthLayout,
    AuthForm,
} from "../components/auth";

interface RegisterErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState<RegisterErrors>({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: RegisterErrors = {};

        if (!email.trim()) {
            newErrors.email = "El correo electrónico es obligatorio.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            newErrors.email = "Ingresa un correo electrónico válido.";
        }

        if (!password) {
            newErrors.password = "La contraseña es obligatoria.";
        } else if (password.length < 8) {
            newErrors.password =
                "La contraseña debe tener al menos 8 caracteres.";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword =
                "Debes confirmar tu contraseña.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword =
                "Las contraseñas no coinciden.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // Simulación temporal para probar el estado de correo duplicado.
        // Se reemplazará por auth.service.ts cuando conectemos la API.
        if (email.trim().toLowerCase() === "docente@kalibra.com") {
            setError("Este correo electrónico ya está registrado.");
            setLoading(false);
            return;
        }

        setSuccess(
            "Formulario validado correctamente. El registro estará disponible cuando se conecte la API."
        );

        setLoading(false);
    };

    return (
        <AuthLayout
            title="Transforma la forma de enseñar"
            description="Gestiona tus cursos, identifica brechas de aprendizaje y acompaña el progreso de tus estudiantes desde Kalibra."
        >
            <AuthForm
                mode="register"
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                onEmailChange={(value) => {
                    setEmail(value);
                    setErrors((previous) => ({
                        ...previous,
                        email: undefined,
                    }));
                }}
                onPasswordChange={(value) => {
                    setPassword(value);
                    setErrors((previous) => ({
                        ...previous,
                        password: undefined,
                    }));
                }}
                onConfirmPasswordChange={(value) => {
                    setConfirmPassword(value);
                    setErrors((previous) => ({
                        ...previous,
                        confirmPassword: undefined,
                    }));
                }}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                success={success}
                onDismissAlert={() => {
                    setError("");
                    setSuccess("");
                }}
                emailError={errors.email}
                passwordError={errors.password}
                confirmPasswordError={errors.confirmPassword}
                footer={
                    <p>
                        ¿Ya tienes una cuenta?{" "}
                        <a
                            href="/iniciar-sesion"
                            className="font-semibold text-indigo-600 hover:underline"
                        >
                            Iniciar sesión
                        </a>
                    </p>
                }
            />
        </AuthLayout>
    );
}
