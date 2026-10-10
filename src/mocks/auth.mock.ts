/**
 * Simulated authentication endpoints and public demo credentials.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { AuthServiceContract } from '@/services/auth.contract'
import { AuthError, type AuthResponse, type AuthUser } from '@/types/auth'
import { validateAuth } from '@/utils/authValidation'
import { respond } from '@/mocks/scenario'
import { getMockSession, setMockSession, subscribeMockSession } from '@/mocks/session'

interface MockUser extends AuthUser {
  password: string
}
// Deliberately public demo credentials; these accounts exist only in browser memory.
const users: MockUser[] = [
  {
    id: 1,
    firstName: 'Ricardo',
    lastName: 'Salas Vega',
    email: 'docente@kalibra.com',
    password: 'Kalibra123',
    role: 'TEACHER',
    status: true,
  },
]

function authenticate(account: MockUser): AuthResponse {
  const user: AuthUser = {
    id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    role: account.role,
    status: account.status,
  }
  const response = { user, accessToken: `mock-token-${user.id}` }
  setMockSession(response)
  return response
}

/** Implements registration, sign-in and logout with cancellable simulated responses. */
export const authMock: AuthServiceContract = {
  /**
   * Registers a new account with an initially empty workspace.
   *
   * @param data - Profile and credentials to validate.
   * @param signal - Signal that cancels the operation before identity changes.
   * @returns The authenticated profile.
   * @throws AuthError when validation fails or the email already exists.
   */
  async register(data, signal) {
    await respond(null, signal)
    const email = data.email.trim().toLowerCase()
    if (users.some((user) => user.email === email))
      throw new AuthError('duplicate-email', 'Ya existe una cuenta con este correo. Inicia sesión o usa otro correo.')
    const errors = validateAuth(
      { fullName: `${data.firstName} ${data.lastName}`, email, password: data.password },
      true,
    )
    if (
      !data.firstName.trim() ||
      !data.lastName.trim() ||
      Object.keys(errors).length ||
      data.password !== data.confirmPassword
    ) {
      throw new AuthError('invalid-input', 'Revisa los datos de tu cuenta.')
    }
    const user: MockUser = {
      id: users.length + 1,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email,
      password: data.password,
      role: 'TEACHER',
      status: true,
    }
    users.push(user)
    return authenticate(user)
  },
  /**
   * Signs in a known active demo account.
   *
   * @param data - Credentials entered by the user.
   * @param signal - Signal that cancels the operation before identity changes.
   * @returns The authenticated profile.
   * @throws AuthError for incorrect credentials or an inactive account.
   */
  async login(data, signal) {
    await respond(null, signal)
    const user = users.find(
      (item) => item.email === data.email.trim().toLowerCase() && item.password === data.password && item.status,
    )
    if (!user) throw new AuthError('invalid-credentials', 'Correo o contraseña incorrectos')
    return authenticate(user)
  },
  /**
   * Clears the demo session after the simulated response.
   *
   * @param signal - Signal that cancels the operation before identity changes.
   * @returns Nothing.
   * @throws Error when cancelled.
   */
  async logout(signal) {
    await respond(null, signal)
    setMockSession(null)
  },
  /** Reads the current identity snapshot. */
  getSession: getMockSession,
  /** Subscribes navigation to identity changes. */
  subscribe: subscribeMockSession,
}
