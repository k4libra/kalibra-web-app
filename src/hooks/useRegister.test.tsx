/**
 * Register hook validation, submission and recovery tests.
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
import { useRegister } from '@/hooks/useRegister'

const response = {
  user: {
    id: 100,
    firstName: 'Ana',
    lastName: 'Torres',
    email: 'ana@example.edu',
    role: 'TEACHER' as const,
    status: true,
  },
  accessToken: 'mock-only',
}
afterEach(() => vi.restoreAllMocks())

function mount() {
  return renderHook(() => ({ form: useRegister(), location: useLocation() }), {
    wrapper: ({ children }) => (
      <ActiveCourseProvider>
        <MemoryRouter initialEntries={['/registro']}>{children}</MemoryRouter>
      </ActiveCourseProvider>
    ),
  })
}

describe('useRegister', () => {
  it('keeps invalid input local without calling the service', async () => {
    const service = vi.spyOn(authService, 'register')
    const { result } = mount()
    await act(async () => result.current.form.onSubmit())
    expect(result.current.form.errors.email).toBeTruthy()
    expect(service).not.toHaveBeenCalled()
  })
  it('adapts valid fields and opens courses after success', async () => {
    const service = vi.spyOn(authService, 'register').mockResolvedValue(response)
    const { result } = mount()
    act(() => {
      result.current.form.onChange('fullName', 'Ana Torres')
      result.current.form.onChange('email', 'ana@example.edu')
      result.current.form.onChange('password', 'Demo2025')
    })
    await act(async () => result.current.form.onSubmit())
    expect(service).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'ana@example.edu',
        firstName: 'Ana',
        lastName: 'Torres',
        confirmPassword: 'Demo2025',
      }),
      expect.any(AbortSignal),
    )
    expect(result.current.location.pathname).toBe('/cursos')
  })
  it('exposes duplicate email and recovers with another email', async () => {
    vi.spyOn(authService, 'register').mockRejectedValue(new AuthError('duplicate-email', 'Failure'))
    const { result } = mount()
    act(() => {
      result.current.form.onChange('fullName', 'Ana Torres')
      result.current.form.onChange('email', 'ana@example.edu')
      result.current.form.onChange('password', 'Demo2025')
    })
    await act(async () => result.current.form.onSubmit())
    expect(result.current.form.error).toBe('Failure')
    expect(result.current.form.isDuplicateEmail).toBe(true)
    act(() => result.current.form.onUseAnotherEmail())
    expect(result.current.form.error).toBeNull()
    expect(result.current.form.values.password).toBe('Demo2025')
    expect(result.current.form.values.email).toBe('')
  })
})
