
import type { FormEvent, ReactNode } from "react";

import PasswordField from "./PasswordField";
import AuthAlert from "./AuthAlert";

interface AuthFormProps {
    mode: "login" | "register";

    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    confirmPassword?: string;

    onFirstNameChange?: (value: string) => void;
    onLastNameChange?: (value: string) => void;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange?: (value: string) => void;

    onSubmit: (event: FormEvent<HTMLFormElement>) => void;

    loading?: boolean;
    error?: string;
    success?: string;
    onDismissAlert?: () => void;

    firstNameError?: string;
    lastNameError?: string;
    emailError?: string;
    passwordError?: string;
    confirmPasswordError?: string;

    footer?: ReactNode;
}

export default function AuthForm({
                                     mode,
                                     firstName = "",
                                     lastName = "",
                                     email,
                                     password,
                                     confirmPassword = "",
                                     onFirstNameChange,
                                     onLastNameChange,
                                     onEmailChange,
                                     onPasswordChange,
                                     onConfirmPasswordChange,
                                     onSubmit,
                                     loading = false,
                                     error,
                                     success,
                                     onDismissAlert,
                                     firstNameError,
                                     lastNameError,
                                     emailError,
                                     passwordError,
                                     confirmPasswordError,
                                     footer,
                                 }: AuthFormProps) {
    const isRegister = mode === "register";

    const inputClass = (hasError: boolean) =>
        `w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition ${
            hasError
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-indigo-600"
        } disabled:cursor-not-allowed disabled:bg-gray-100`;

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                    {isRegister
                        ? "Crear cuenta de docente"
                        : "Bienvenido de nuevo"}
                </h2>

                <p className="mt-3 text-sm text-gray-500">
                    {isRegister
                        ? "Regístrate para comenzar a gestionar tus cursos en Kalibra."
                        : "Ingresa tus credenciales para acceder al portal docente."}
                </p>
            </div>

            <form onSubmit={onSubmit} noValidate className="space-y-5">
                {error && (
                    <AuthAlert
                        type="error"
                        message={error}
                        onClose={onDismissAlert}
                    />
                )}

                {success && (
                    <AuthAlert
                        type="success"
                        message={success}
                        onClose={onDismissAlert}
                    />
                )}

                {isRegister && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="auth-first-name"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Nombre
                            </label>

                            <input
                                id="auth-first-name"
                                name="firstName"
                                type="text"
                                value={firstName}
                                onChange={(event) =>
                                    onFirstNameChange?.(event.target.value)
                                }
                                placeholder="Tu nombre"
                                autoComplete="given-name"
                                maxLength={100}
                                disabled={loading}
                                aria-invalid={Boolean(firstNameError)}
                                aria-describedby={
                                    firstNameError
                                        ? "auth-first-name-error"
                                        : undefined
                                }
                                className={inputClass(Boolean(firstNameError))}
                            />

                            {firstNameError && (
                                <p
                                    id="auth-first-name-error"
                                    role="alert"
                                    className="mt-1 text-xs text-red-500"
                                >
                                    {firstNameError}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="auth-last-name"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Apellido
                            </label>

                            <input
                                id="auth-last-name"
                                name="lastName"
                                type="text"
                                value={lastName}
                                onChange={(event) =>
                                    onLastNameChange?.(event.target.value)
                                }
                                placeholder="Tu apellido"
                                autoComplete="family-name"
                                maxLength={100}
                                disabled={loading}
                                aria-invalid={Boolean(lastNameError)}
                                aria-describedby={
                                    lastNameError
                                        ? "auth-last-name-error"
                                        : undefined
                                }
                                className={inputClass(Boolean(lastNameError))}
                            />

                            {lastNameError && (
                                <p
                                    id="auth-last-name-error"
                                    role="alert"
                                    className="mt-1 text-xs text-red-500"
                                >
                                    {lastNameError}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div>
                    <label
                        htmlFor="auth-email"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Correo electrónico
                    </label>

                    <input
                        id="auth-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            onEmailChange(event.target.value)
                        }
                        placeholder="docente@universidad.edu.pe"
                        autoComplete="email"
                        maxLength={100}
                        disabled={loading}
                        aria-invalid={Boolean(emailError)}
                        aria-describedby={
                            emailError ? "auth-email-error" : undefined
                        }
                        className={inputClass(Boolean(emailError))}
                    />

                    {emailError && (
                        <p
                            id="auth-email-error"
                            role="alert"
                            className="mt-1 text-xs text-red-500"
                        >
                            {emailError}
                        </p>
                    )}
                </div>

                <PasswordField
                    id="auth-password"
                    label="Contraseña"
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="Ingresa tu contraseña"
                    autoComplete={
                        isRegister ? "new-password" : "current-password"
                    }
                    error={passwordError}
                    disabled={loading}
                />

                {isRegister && (
                    <PasswordField
                        id="auth-confirm-password"
                        label="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(value) =>
                            onConfirmPasswordChange?.(value)
                        }
                        placeholder="Confirma tu contraseña"
                        autoComplete="new-password"
                        error={confirmPasswordError}
                        disabled={loading}
                    />
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-lg bg-[#4738ed] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3727d4] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Procesando..."
                        : isRegister
                            ? "Crear cuenta"
                            : "Iniciar sesión"}
                </button>
            </form>

            {footer && (
                <div className="mt-6 text-center text-sm text-gray-600">
                    {footer}
                </div>
            )}
        </div>
    );
}
