/**
 * Tests for the course subtopics and create course hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCourseSubtopics } from './useCourseSubtopics'
import { useCreateCourse } from './useCreateCourse'

describe('useCourseSubtopics', () => {
  it('exposes the course and its subtopics', async () => {
    const { result } = renderHook(() => useCourseSubtopics('course-1'))
    await waitFor(() => expect(result.current.course?.id).toBe('course-1'))
    expect(result.current.subtopics.length).toBeGreaterThan(0)
  })

  it('exposes an error for an unknown course', async () => {
    const { result } = renderHook(() => useCourseSubtopics('missing'))
    await waitFor(() => expect(result.current.error).not.toBeNull())
  })
})

describe('useCreateCourse', () => {
  it('returns the created course with its subtopic count', async () => {
    const { result } = renderHook(() => useCreateCourse())
    let created = null
    await act(async () => {
      created = await result.current.createCourse({ name: 'Física I', code: 'FI-101', term: '2025-II', subtopics: ['Cinemática'] })
    })
    expect(created).toMatchObject({ name: 'Física I', subtopicCount: 1 })
  })
})
