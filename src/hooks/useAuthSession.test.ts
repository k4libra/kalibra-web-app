/**
 * Reactive session hook identity transition tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { authService } from '@/services/auth.service'
import { useAuthSession } from '@/hooks/useAuthSession'

vi.mock('@/mocks/scenario', () => ({
  respond: async <T>(data: T) => structuredClone(data),
  isEmptyScenario: () => false,
}))
afterEach(async () => {
  await act(async () => authService.logout())
})

describe('useAuthSession', () => {
  it('reacts to sign-in and logout snapshots', async () => {
    const { result } = renderHook(() => useAuthSession())
    expect(result.current).toBeNull()
    await act(async () => {
      await authService.login({ email: 'docente@kalibra.com', password: 'Kalibra123' })
    })
    expect(result.current?.user.email).toBe('docente@kalibra.com')
    await act(async () => authService.logout())
    expect(result.current).toBeNull()
  })
})
