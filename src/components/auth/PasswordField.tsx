
import { useState } from "react";
import type { ChangeEvent } from "react";

interface PasswordFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    autoComplete?: string;
}

export default function PasswordField({
                                          id,
                                          label,
                                          value,
                                          onChange,
                                          placeholder = "Ingresa tu contraseña",
                                          error,
                                          disabled = false,
                                          autoComplete = "current-password",
                                      }: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className="w-full">
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-medium text-gray-700"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`w-full rounded-lg border bg-white px-4 py-3 pr-12 text-sm outline-none transition
            ${
                        error
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-indigo-600"
                    }
            disabled:cursor-not-allowed disabled:bg-gray-100`}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    disabled={disabled}
                    aria-label={
                        showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-600 disabled:cursor-not-allowed"
                >
                    {showPassword ? (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M3 3l18 18" />
                            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                            <path d="M9.9 5.2A11 11 0 0 1 12 5c5 0 9 4 10 7a13 13 0 0 1-3 4.4" />
                            <path d="M6.5 6.5C4.4 7.8 2.8 9.8 2 12c1 3 5 7 10 7 1.6 0 3.1-.4 4.4-1.1" />
                        </svg>
                    ) : (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}
                </button>
            </div>

            {error && (
                <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
