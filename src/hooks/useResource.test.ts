/**
 * Tests for the generic read hook.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useResource } from './useResource'

describe('useResource', () => {
  it('exposes the loaded data', async () => {
    const { result } = renderHook(() => useResource(() => Promise.resolve(['a']), 'list'))
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toEqual(['a'])
    expect(result.current.error).toBeNull()
  })

  it('exposes the error message of a failed request', async () => {
    const { result } = renderHook(() => useResource(() => Promise.reject(new Error('boom')), 'fail'))
    await waitFor(() => expect(result.current.error).toBe('boom'))
  })
})
