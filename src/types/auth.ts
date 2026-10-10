/**
 * Authentication models and recoverable errors.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

/** Roles supported by the authentication contract. */
export type UserRole = 'TEACHER' | 'STUDENT' | 'ADMINISTRATOR' | 'REGISTERED_USER'

/** Credentials submitted to sign in. */
export interface LoginRequest {
  /** Institutional email address. */
  email: string
  /** Password entered by the user. */
  password: string
}

/** Teacher profile and credentials submitted to register. */
export interface RegisterRequest extends LoginRequest {
  /** Given names extracted from the full-name field. */
  firstName: string
  /** Family names extracted from the full-name field. */
  lastName: string
  /** Confirmation adapted from the single designed password field. */
  confirmPassword: string
}

/** Public profile returned after authentication. */
export interface AuthUser {
  /** Unique account identifier. */
  id: string
  /** Given names displayed in greetings. */
  firstName: string
  /** Family names displayed in the sidebar. */
  lastName: string
  /** Institutional email address. */
  email: string
  /** Access role of the account. */
  role: UserRole
}

/** Authenticated public profile; the credential remains in an httpOnly cookie. */
export interface AuthResponse {
  /** Public account profile. */
  user: AuthUser
}

/** Failures the auth interface distinguishes. */
export type AuthErrorCode = 'invalid-credentials' | 'duplicate-email' | 'invalid-input'

/** Typed authentication failure suitable for field and notice recovery. */
export class AuthError extends Error {
  /** Recovery category of the failure. */
  readonly code: AuthErrorCode
  /**
   * Creates a recoverable authentication failure.
   *
   * @param code - Recovery category exposed to the form.
   * @param message - User-facing explanation.
   */
  constructor(code: AuthErrorCode, message: string) {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}

/** Values of the designed authentication form. */
export interface AuthFormValues extends LoginRequest {
  /** Full name used only in registration. */
  fullName: string
}

/** Validation messages associated with individual fields. */
export type AuthFieldErrors = Partial<Record<keyof AuthFormValues, string>>
