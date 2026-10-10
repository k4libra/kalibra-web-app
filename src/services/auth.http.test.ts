/**
 * Tests web authentication payloads and protection against obsolete session restoration.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it, vi } from 'vitest'
import { authService } from '@/services/auth.service'
import { sessionStore } from '@/services/http/sessionStore'
import { adminDto, teacherCredentials } from '@/test/apiStub'

function payload(path: string) {
  const [, init] = vi.mocked(fetch).mock.calls.find(([url]) => String(url).endsWith(path))!
  return JSON.parse(String(init?.body)) as Record<string, unknown>
}

describe('web authentication HTTP contract', () => {
  it('signs in with WEB_PLATFORM and keeps credentials only in the cookie', async () => {
    const response = await authService.login(teacherCredentials)
    expect(payload('/authentication/sign-in')).toEqual({ ...teacherCredentials, application: 'WEB_PLATFORM' })
    expect(response).not.toHaveProperty('accessToken')
    expect(response.user).not.toHaveProperty('password')
  })
  it('sends both names during registration and signs in after account creation', async () => {
    const input = { firstName: 'Profesor', lastName: 'Test Nuevo', email: 'profesor.nuevo@example.edu', password: 'Test2026', confirmPassword: 'Test2026' }
    await authService.register(input)
    expect(payload('/authentication/sign-up')).toEqual({ firstName: input.firstName, lastName: input.lastName, email: input.email, password: input.password, application: 'WEB_PLATFORM' })
    expect(payload('/authentication/sign-up')).not.toHaveProperty('confirmPassword')
    expect(sessionStore.getSession()?.user.email).toBe(input.email)
    expect(vi.mocked(fetch).mock.calls.map(([url]) => String(url))).toEqual(['/api/v1/authentication/sign-up', '/api/v1/authentication/sign-in'])
  })
  it('explains that student accounts must use the mobile application', async () => {
    await expect(authService.login({ email: 'estudiante.test1@upc.edu.pe', password: '@estudiantetest1' })).rejects.toMatchObject({ message: 'Las cuentas de estudiantes deben usar la aplicación móvil.' })
    expect(sessionStore.getSession()).toBeNull()
  })
  it('ignores a delayed users/me response after a successful new sign-in', async () => {
    sessionStore.reset()
    let resolve!: (response: Response) => void
    vi.mocked(fetch).mockImplementationOnce(() => new Promise((done) => { resolve = done }))
    const pending = authService.restore()
    await authService.login(teacherCredentials)
    resolve(new Response(JSON.stringify(adminDto)))
    await pending
    expect(sessionStore.getSession()?.user.role).toBe('TEACHER')
  })
  it('keeps the session available when sign-out fails', async () => {
    await authService.login(teacherCredentials)
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 503 }))
    await expect(authService.logout()).rejects.toMatchObject({ code: 'unavailable' })
    expect(sessionStore.getSession()?.user.role).toBe('TEACHER')
  })
})
