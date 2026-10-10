/**
 * Authentication contract shared by the mock and future remote adapter.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth'

/** Operations supplied by a simulated or remote authentication adapter. */
export interface AuthServiceContract {
  /**
   * Registers a teacher and starts the account session.
   *
   * @param data - Validated profile and credentials.
   * @param signal - Cancellation signal for an obsolete submission.
   * @returns The authenticated profile.
   * @throws AuthError for invalid input or an existing email.
   */
  register: (data: RegisterRequest, signal?: AbortSignal) => Promise<AuthResponse>
  /**
   * Starts a session with valid credentials.
   *
   * @param data - Email and password entered in the form.
   * @param signal - Cancellation signal for an obsolete submission.
   * @returns The authenticated profile.
   * @throws AuthError for invalid credentials.
   */
  login: (data: LoginRequest, signal?: AbortSignal) => Promise<AuthResponse>
  /**
   * Ends the in-memory demo session.
   *
   * @param signal - Cancellation signal for an obsolete submission.
   * @returns Nothing after the session is cleared.
   * @throws Error when the operation is cancelled.
   */
  logout: (signal?: AbortSignal) => Promise<void>
  /** Reads a stable session snapshot for the navigation guard. */
  getSession: () => AuthResponse | null
  /** Observes identity changes and returns an unsubscribe callback. */
  subscribe: (listener: () => void) => () => void
}
