/**
 * Logout confirmation, cancellation and retry navigation tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ActiveCourseProvider } from '@/context/ActiveCourseContext'
import { authService } from '@/services/auth.service'
import { useLogout } from '@/hooks/useLogout'

afterEach(() => vi.restoreAllMocks())
function mount() {
  return renderHook(() => ({ logout: useLogout(), location: useLocation() }), {
    wrapper: ({ children }) => (
      <ActiveCourseProvider>
        <MemoryRouter initialEntries={['/invitaciones']}>{children}</MemoryRouter>
      </ActiveCourseProvider>
    ),
  })
}

describe('useLogout', () => {
  it('opens confirmation and cancels without calling logout or changing the page', () => {
    const service = vi.spyOn(authService, 'logout')
    const { result } = mount()
    act(() => result.current.logout.open())
    expect(result.current.logout.isOpen).toBe(true)
    act(() => result.current.logout.cancel())
    expect(result.current.logout.isOpen).toBe(false)
    expect(result.current.location.pathname).toBe('/invitaciones')
    expect(service).not.toHaveBeenCalled()
  })
  it('keeps a failure in the open dialog and navigates after a successful retry', async () => {
    const service = vi
      .spyOn(authService, 'logout')
      .mockRejectedValueOnce(new Error('Failure'))
      .mockResolvedValueOnce(undefined)
    const { result } = mount()
    act(() => result.current.logout.open())
    await act(async () => result.current.logout.confirm())
    expect(result.current.logout.error).toBe('Failure')
    expect(result.current.logout.isOpen).toBe(true)
    expect(result.current.location.pathname).toBe('/invitaciones')
    await act(async () => result.current.logout.confirm())
    expect(service).toHaveBeenCalledTimes(2)
    expect(result.current.location.pathname).toBe('/iniciar-sesion')
  })
})
