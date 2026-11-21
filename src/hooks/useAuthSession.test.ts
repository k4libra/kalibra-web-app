/**
 * Reactive session hook identity transition tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { authService } from '@/services/auth.service'
import { useAuthSession } from '@/hooks/useAuthSession'

afterEach(async () => {
  await act(async () => authService.logout())
})

describe('useAuthSession', () => {
  it('reacts to sign-in and logout snapshots', async () => {
    const { result } = renderHook(() => useAuthSession())
    expect(result.current).toBeNull()
    await act(async () => {
      await authService.login({ email: 'profesor.test1@upc.edu.pe', password: '@profesortest1' })
    })
    expect(result.current?.user.email).toBe('profesor.test1@upc.edu.pe')
    await act(async () => authService.logout())
    expect(result.current).toBeNull()
  })
})
