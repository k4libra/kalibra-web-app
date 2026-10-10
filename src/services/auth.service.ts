/**
 * Authenticates web accounts against the API and restores the cookie session.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { AuthServiceContract } from '@/services/auth.contract'
import { apiClient } from '@/services/http/apiClient'
import { sessionStore } from '@/services/http/sessionStore'
import { mapUser } from '@/services/mappers/auth.mapper'
import type { UserDto } from '@/types/api'
import { ApiError } from '@/types/apiError'
import { AuthError, type LoginRequest } from '@/types/auth'
let restoration: Promise<void> | null = null
async function login(data: LoginRequest, signal?: AbortSignal) {
  try {
    const dto = await apiClient.post<UserDto>('/authentication/sign-in', { ...data, application: 'WEB_PLATFORM' }, { signal })
    signal?.throwIfAborted()
    const session = mapUser(dto)
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMINISTRATOR') {
      await apiClient.post('/authentication/sign-out', undefined, { signal })
      sessionStore.setSession(null)
      throw new AuthError('invalid-input', 'Las cuentas de estudiantes deben usar la aplicación móvil.')
    }
    sessionStore.setSession(session)
    return session
  } catch (reason) {
    if (reason instanceof ApiError && reason.status === 401) throw new AuthError('invalid-credentials', 'Correo o contraseña incorrectos.')
    if (reason instanceof ApiError && reason.status === 403) throw new AuthError('invalid-input', 'Las cuentas de estudiantes deben usar la aplicación móvil.')
    throw reason
  }
}
/** Implements cookie authentication, registration and startup restoration. */
export const authService: AuthServiceContract = {
  login,
  async register(data, signal) {
    if (!data.firstName.trim() || !data.lastName.trim() || data.password !== data.confirmPassword) throw new AuthError('invalid-input', 'Revisa tus nombres y contraseña.')
    try {
      await apiClient.post<UserDto>('/authentication/sign-up', { firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password, application: 'WEB_PLATFORM' }, { signal })
      // Sign-up creates the account but does not issue the session cookie.
      return await login({ email: data.email, password: data.password }, signal)
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 409) throw new AuthError('duplicate-email', 'Este correo ya tiene una cuenta registrada.')
      throw reason
    }
  },
  async logout(signal) { await apiClient.post('/authentication/sign-out', undefined, { signal }); sessionStore.setSession(null) },
  getSession: sessionStore.getSession,
  subscribe: sessionStore.subscribe,
  restore() {
    if (restoration) return restoration
    if (!sessionStore.getSnapshot().isLoading) return Promise.resolve()
    const revision = sessionStore.getRevision()
    restoration = apiClient.get<UserDto>('/users/me').then((dto) => {
      if (sessionStore.getRevision() === revision) sessionStore.setSession(mapUser(dto))
    }).catch((reason: unknown) => {
      if (sessionStore.getRevision() !== revision) return
      if (reason instanceof ApiError && reason.status === 401) sessionStore.setSession(null)
      else sessionStore.fail(reason instanceof Error ? reason.message : 'No se pudo restaurar la sesión.')
    }).finally(() => { restoration = null })
    return restoration
  },
}
