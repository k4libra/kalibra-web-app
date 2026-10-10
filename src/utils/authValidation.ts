/**
 * Pure authentication field validation and contract adaptation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { AuthFieldErrors, AuthFormValues, RegisterRequest } from '@/types/auth'

/**
 * Validates the designed sign-in or registration fields.
 *
 * @param values - Current field values.
 * @param isRegister - Whether full-name and password-strength validation applies.
 * @returns Field messages; an empty object means the values are valid.
 *
 * @example
 * ```ts
 * validateAuth({ fullName: '', email: '', password: '' }, false); // Required-field messages.
 * ```
 */
export function validateAuth(values: AuthFormValues, isRegister: boolean): AuthFieldErrors {
  const errors: AuthFieldErrors = {}
  if (isRegister && values.fullName.trim().split(/\s+/).length < 2) errors.fullName = 'Ingresa tu nombre completo.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Ingresa un correo electrónico válido.'
  if (!values.password) errors.password = 'La contraseña es obligatoria.'
  else if (
    isRegister &&
    (values.password.length < 8 || !/[a-zA-Z]/.test(values.password) || !/\d/.test(values.password))
  ) {
    errors.password = 'Usa al menos 8 caracteres, letras y números.'
  }
  return errors
}

/**
 * Adapts the single full-name and password controls to the registration contract.
 *
 * @param values - Validated registration fields.
 * @returns The profile and matching password confirmation required by the contract.
 *
 * @example
 * ```ts
 * toRegisterRequest({ fullName: 'Ana Torres', email: 'ana@example.edu', password: 'Demo2025' });
 * ```
 */
export function toRegisterRequest(values: AuthFormValues): RegisterRequest {
  const [firstName, ...lastNames] = values.fullName.trim().split(/\s+/)
  return {
    firstName,
    lastName: lastNames.join(' '),
    email: values.email.trim(),
    password: values.password,
    confirmPassword: values.password,
  }
}
