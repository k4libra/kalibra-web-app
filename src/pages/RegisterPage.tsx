
import { useState } from "react";
import type { FormEvent } from "react";

import {
    AuthLayout,
    AuthForm,
} from "../components/auth";

import { useRegister } from "../hooks/useRegister";

interface RegisterErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
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

        if (!firstName.trim()) {
            newErrors.firstName = "El nombre es obligatorio.";
        } else if (firstName.trim().length > 100) {
            newErrors.firstName =
                "El nombre no puede superar los 100 caracteres.";
        }

        if (!lastName.trim()) {
            newErrors.lastName = "El apellido es obligatorio.";
        } else if (lastName.trim().length > 100) {
            newErrors.lastName =
                "El apellido no puede superar los 100 caracteres.";
        }

        if (!email.trim()) {
            newErrors.email =
                "El correo electrónico es obligatorio.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            newErrors.email =
                "Ingresa un correo electrónico válido.";
        } else if (email.trim().length > 100) {
            newErrors.email =
                "El correo no puede superar los 100 caracteres.";
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
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password,
            confirmPassword,
        });

        if (response) {
            // Registro simulado exitoso.
            // La API real se conectará posteriormente.
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
                firstName={firstName}
                lastName={lastName}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                onFirstNameChange={(value) => {
                    setFirstName(value);
                    setErrors((previous) => ({
                        ...previous,
                        firstName: undefined,
                    }));
                    clearError();
                }}
                onLastNameChange={(value) => {
                    setLastName(value);
                    setErrors((previous) => ({
                        ...previous,
                        lastName: undefined,
                    }));
                    clearError();
                }}
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
                firstNameError={errors.firstName}
                lastNameError={errors.lastName}
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
