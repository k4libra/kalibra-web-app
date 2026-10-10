/**
 * Authentication contract errors, cancellation and account isolation tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { authService } from '@/services/auth.service'
import { coursesService } from '@/services/courses.service'
import { invitationsService } from '@/services/invitations.service'
import { exercisesService } from '@/services/exercises.service'
import { apiStub } from '@/test/apiStub'
import { AuthError } from '@/types/auth'

const credentials = { email: 'profesor.test1@upc.edu.pe', password: '@profesortest1' }
const registration = {
  firstName: 'Ana',
  lastName: 'Torres',
  email: 'ana@example.edu',
  password: 'Demo2025',
  confirmPassword: 'Demo2025',
}

async function complete<T>(pending: Promise<T>): Promise<T> {
  const observed = pending.then(
    (value) => ({ value }),
    (error: unknown) => ({ error }),
  )
  await vi.advanceTimersByTimeAsync(150)
  const result = await observed
  if ('error' in result) throw result.error
  return result.value
}

beforeEach(() => vi.useFakeTimers())
afterEach(async () => {
  await complete(authService.logout())
  vi.useRealTimers()
  window.history.replaceState({}, '', '/')
})

describe('authService', () => {
  it('rejects incorrect credentials with a recoverable code', async () => {
    await expect(complete(authService.login({ ...credentials, password: 'wrong' }))).rejects.toMatchObject({
      code: 'invalid-credentials',
    })
    expect(authService.getSession()).toBeNull()
  })
  it('uses the authenticated identity for the teacher profile and clears it on logout', async () => {
    const response = await complete(authService.login(credentials))
    expect(response.user.email).toBe(credentials.email)
    expect(response.user).not.toHaveProperty('password')
    expect(await complete(coursesService.getCurrentTeacher())).toMatchObject({
      firstName: response.user.firstName,
      email: response.user.email,
    })
    await complete(authService.logout())
    expect(authService.getSession()).toBeNull()
  })
  it('rejects duplicate email without starting a session', async () => {
    await expect(
      complete(authService.register({ ...registration, email: ' PROFESOR.TEST1@UPC.EDU.PE ' })),
    ).rejects.toBeInstanceOf(AuthError)
    await expect(complete(authService.register({ ...registration, email: credentials.email }))).rejects.toMatchObject({
      code: 'duplicate-email',
    })
  })
  it('rejects invalid profile and mismatching confirmation', async () => {
    await expect(
      complete(authService.register({ ...registration, firstName: '', email: 'invalid@example.edu' })),
    ).rejects.toMatchObject({ code: 'invalid-input' })
    await expect(
      complete(authService.register({ ...registration, email: 'confirmation@example.edu', confirmPassword: 'wrong' })),
    ).rejects.toMatchObject({ code: 'invalid-input' })
  })
  it('cancels obsolete authentication before changing identity', async () => {
    const controller = new AbortController()
    const pending = authService.login(credentials, controller.signal)
    controller.abort()
    await expect(complete(pending)).rejects.toMatchObject({ name: 'AbortError' })
    expect(authService.getSession()).toBeNull()
  })
  it('scopes courses, subtopics, invitations and exercises to the registered account across sign-ins', async () => {
    await complete(authService.register(registration))
    expect(await complete(coursesService.listCourses())).toEqual([])
    await expect(coursesService.listSubtopics('course-1')).rejects.toMatchObject({ status: 404 })
    await expect(complete(coursesService.getCourse('course-1'))).rejects.toThrow()
    expect(await complete(invitationsService.listInvitations())).toEqual([])
    expect(await complete(exercisesService.listCatalogs())).toEqual([])
    const created = await complete(
      coursesService.createCourse({
        name: 'Curso de prueba',
        code: 'CT-100',
        term: '2026-II',
        subtopics: ['Tema inicial'],
      }),
    )
    expect(await complete(coursesService.listCourses())).toEqual([created])
    expect(await complete(coursesService.listSubtopics(created.id))).toHaveLength(1)
    await complete(authService.logout())
    await complete(authService.login(credentials))
    expect((await complete(coursesService.listCourses())).some((course) => course.id === created.id)).toBe(false)
    apiStub.empty()
    expect(await complete(coursesService.listCourses())).toEqual([])
    expect(await complete(invitationsService.listInvitations())).toEqual([])
    expect(await complete(exercisesService.listCatalogs())).toEqual([])
    await complete(authService.logout())
    await complete(authService.login(registration))
    expect(await complete(coursesService.listCourses())).toEqual([created])
  })
})
