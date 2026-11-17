/**
 * Tests availability refresh, failure fallback and request cleanup.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCurricularExtractionAvailability } from '@/hooks/useCurricularExtractionAvailability'
import { curricularExtractionAvailabilityService } from '@/services/curricularExtractionAvailability.service'

describe('useCurricularExtractionAvailability', () => {
  it('allows upload initially and reads availability on mount', async () => {
    const read = vi.spyOn(curricularExtractionAvailabilityService, 'getAvailability').mockResolvedValue({ available: false })
    const { result } = renderHook(() => useCurricularExtractionAvailability())
    expect(result.current.available).toBe(true)
    await waitFor(() => expect(result.current.available).toBe(false))
    expect(read).toHaveBeenCalledTimes(1)
    expect(read).toHaveBeenCalledWith(expect.any(AbortSignal))
  })

  it('refreshes on focus and re-enables upload automatically', async () => {
    const read = vi.spyOn(curricularExtractionAvailabilityService, 'getAvailability')
      .mockResolvedValueOnce({ available: false }).mockResolvedValueOnce({ available: true })
    const { result } = renderHook(() => useCurricularExtractionAvailability())
    await waitFor(() => expect(result.current.available).toBe(false))
    act(() => window.dispatchEvent(new Event('focus')))
    await waitFor(() => expect(result.current.available).toBe(true))
    expect(read).toHaveBeenCalledTimes(2)
  })

  it('keeps upload enabled when the initial availability request fails', async () => {
    const read = vi.spyOn(curricularExtractionAvailabilityService, 'getAvailability').mockRejectedValue(new Error('read failed'))
    const { result } = renderHook(() => useCurricularExtractionAvailability())
    await act(async () => {})
    expect(read).toHaveBeenCalledTimes(1)
    expect(result.current.available).toBe(true)
  })

  it('restores upload after a focus refresh fails, even after unavailability', async () => {
    vi.spyOn(curricularExtractionAvailabilityService, 'getAvailability')
      .mockResolvedValueOnce({ available: false }).mockRejectedValueOnce(new Error('read failed'))
    const { result } = renderHook(() => useCurricularExtractionAvailability())
    await waitFor(() => expect(result.current.available).toBe(false))
    act(() => window.dispatchEvent(new Event('focus')))
    await waitFor(() => expect(result.current.available).toBe(true))
  })

  it('ignores stale responses and aborts requests and focus listening on unmount', async () => {
    let resolve!: (value: { available: boolean }) => void
    const read = vi.spyOn(curricularExtractionAvailabilityService, 'getAvailability')
      .mockImplementationOnce(() => new Promise((done) => { resolve = done }))
      .mockResolvedValueOnce({ available: false })
    const { result, unmount } = renderHook(() => useCurricularExtractionAvailability())
    const firstSignal = read.mock.calls[0][0]
    act(() => window.dispatchEvent(new Event('focus')))
    await waitFor(() => expect(result.current.available).toBe(false))
    expect(firstSignal?.aborted).toBe(true)
    await act(async () => resolve({ available: true }))
    expect(result.current.available).toBe(false)
    const lastSignal = read.mock.calls[1][0]
    unmount()
    expect(lastSignal?.aborted).toBe(true)
    act(() => window.dispatchEvent(new Event('focus')))
    expect(read).toHaveBeenCalledTimes(2)
  })
})
