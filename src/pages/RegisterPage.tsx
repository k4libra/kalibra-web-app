
import { useState } from "react";
import type { FormEvent } from "react";

import {
    AuthLayout,
    AuthForm,
} from "../components/auth";

import { useRegister } from "../hooks/useRegister";

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

    const {
        register,
        loading,
        error,
        success,
        clearError,
        reset,
    } = useRegister();

    const validateForm = (): boolean => {
        const newErrors: RegisterErrors = {};

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

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        reset();

        if (!validateForm()) {
            return;
        }

        const response = await register({
            email: email.trim().toLowerCase(),
            password,
            confirmPassword,
        });

        if (response) {
            // El registro se completó en el mock.
            // Aquí podremos gestionar la navegación
            // cuando se integre el flujo real.
            setPassword("");
            setConfirmPassword("");
        }
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
                onConfirmPasswordChange={(value) => {
                    setConfirmPassword(value);

                    setErrors((previous) => ({
                        ...previous,
                        confirmPassword: undefined,
                    }));

                    clearError();
                }}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                success={
                    success
                        ? "Cuenta de prueba registrada correctamente."
                        : undefined
                }
                onDismissAlert={reset}
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
