/**
 * Auth submission concurrency, failure recovery and unmount cancellation tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAuthMutation } from '@/hooks/useAuthMutation'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

describe('useAuthMutation', () => {
  it('blocks repeated submission and exposes failures and recovery', async () => {
    const request = deferred<string>()
    const operation = vi.fn(() => request.promise)
    const { result } = renderHook(() => useAuthMutation(operation))
    let pending!: Promise<string | null>
    act(() => {
      pending = result.current.submit(undefined)
    })
    expect(result.current.isSubmitting).toBe(true)
    await act(async () => {
      expect(await result.current.submit(undefined)).toBeNull()
    })
    expect(operation).toHaveBeenCalledOnce()
    await act(async () => {
      request.reject(new Error('Failure'))
      await pending
    })
    expect(result.current.error?.message).toBe('Failure')
    expect(result.current.isSubmitting).toBe(false)
    act(() => result.current.clearError())
    expect(result.current.error).toBeNull()
  })
  it('aborts on unmount and ignores a late successful result', async () => {
    const request = deferred<string>()
    let signal!: AbortSignal
    const operation = (_input: void, current: AbortSignal) => {
      signal = current
      return request.promise
    }
    const { result, unmount } = renderHook(() => useAuthMutation(operation))
    let pending!: Promise<string | null>
    act(() => {
      pending = result.current.submit()
    })
    unmount()
    expect(signal.aborted).toBe(true)
    request.resolve('obsolete')
    expect(await pending).toBeNull()
  })
})
