/**
 * Tests for the course indicators hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCourseIndicators, useExportIndicators } from './useCourseIndicators'

describe('useCourseIndicators', () => {
  it('exposes the course and its indicators', async () => {
    const { result } = renderHook(() => useCourseIndicators('course-1'))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.course?.id).toBe('course-1')
    expect(result.current.indicators).not.toBeNull()
  })

  it('keeps the indicators empty for a course without activity', async () => {
    const { result } = renderHook(() => useCourseIndicators('course-2'))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.indicators).toBeNull()
  })
})

describe('useExportIndicators', () => {
  it('returns the exported file', async () => {
    const { result } = renderHook(() => useExportIndicators())
    let file = null
    await act(async () => {
      file = await result.current.exportIndicators('course-1')
    })
    expect(file).toMatchObject({ fileName: expect.stringContaining('.csv') })
  })
})
