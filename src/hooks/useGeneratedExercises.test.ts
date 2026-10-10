/**
 * Tests for the generated exercises hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useGenerateExercises } from './useGenerateExercises'
import { useGeneratedExercises } from './useGeneratedExercises'

describe('useGeneratedExercises', () => {
  it('groups the exercises by course, including courses without exercises', async () => {
    const { result } = renderHook(() => useGeneratedExercises())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.groups.length).toBeGreaterThan(1)
    expect(result.current.groups.some((group) => group.catalog.subtopics.length === 0)).toBe(true)
  })

  it('finds an exercise with its subtopic name', async () => {
    const { result } = renderHook(() => useGeneratedExercises())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.findExercise('ex-1')?.subtopicName).toBeTruthy()
    expect(result.current.findExercise('missing')).toBeNull()
  })
})

describe('useGenerateExercises', () => {
  it('returns the outcome of the request', async () => {
    const { result } = renderHook(() => useGenerateExercises())
    let outcome = null
    await act(async () => {
      outcome = await result.current.generate('course-1', 'sub-1')
    })
    expect(outcome).toMatchObject({ generatedCount: 10 })
  })
})
