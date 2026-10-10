/**
 * Login hook validation, submission and recovery tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ActiveCourseProvider } from '@/context/ActiveCourseContext'
import { authService } from '@/services/auth.service'
import { AuthError } from '@/types/auth'
import { useLogin } from '@/hooks/useLogin'

const response = {
  user: {
    id: 'teacher-100',
    firstName: 'Ana',
    lastName: 'Torres',
    email: 'ana@example.edu',
    role: 'TEACHER' as const,
  },
}
afterEach(() => vi.restoreAllMocks())

function mount() {
  return renderHook(() => ({ form: useLogin(), location: useLocation() }), {
    wrapper: ({ children }) => (
      <ActiveCourseProvider>
        <MemoryRouter initialEntries={['/iniciar-sesion']}>{children}</MemoryRouter>
      </ActiveCourseProvider>
    ),
  })
}

describe('useLogin', () => {
  it('keeps invalid input local without calling the service', async () => {
    const service = vi.spyOn(authService, 'login')
    const { result } = mount()
    await act(async () => result.current.form.onSubmit())
    expect(result.current.form.errors.email).toBeTruthy()
    expect(service).not.toHaveBeenCalled()
  })
  it('adapts valid fields and opens courses after success', async () => {
    const service = vi.spyOn(authService, 'login').mockResolvedValue(response)
    const { result } = mount()
    act(() => {
      result.current.form.onChange('fullName', 'Ana Torres')
      result.current.form.onChange('email', 'ana@example.edu')
      result.current.form.onChange('password', 'Demo2025')
    })
    await act(async () => result.current.form.onSubmit())
    expect(service).toHaveBeenCalledWith(expect.objectContaining({ email: 'ana@example.edu' }), expect.any(AbortSignal))
    expect(result.current.location.pathname).toBe('/cursos')
  })
  it('exposes invalid credentials and dismisses without clearing values', async () => {
    vi.spyOn(authService, 'login').mockRejectedValue(new AuthError('invalid-credentials', 'Failure'))
    const { result } = mount()
    act(() => {
      result.current.form.onChange('fullName', 'Ana Torres')
      result.current.form.onChange('email', 'ana@example.edu')
      result.current.form.onChange('password', 'Demo2025')
    })
    await act(async () => result.current.form.onSubmit())
    expect(result.current.form.error).toBe('Failure')

    act(() => result.current.form.onDismiss())
    expect(result.current.form.error).toBeNull()
    expect(result.current.form.values.password).toBe('Demo2025')
    expect(result.current.form.values.email).toBe('ana@example.edu')
  })
})
