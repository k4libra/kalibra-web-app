/**
 * Tests for the course subtopics and create course hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { coursesService } from '@/services/courses.service'
import { ApiError } from '@/types/apiError'
import { COURSES, SUBTOPICS } from '@/test/uiFixtures'
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

  it('filters archived rows and refetches after a successful mutation', async () => {
    vi.spyOn(coursesService, 'getCourse').mockResolvedValue(COURSES[0])
    vi.spyOn(coursesService, 'listSubtopics').mockResolvedValue([{ ...SUBTOPICS[0], status: 'ARCHIVED' }, SUBTOPICS[1]])
    vi.spyOn(coursesService, 'addSubtopic').mockResolvedValue(COURSES[0])
    const { result } = renderHook(() => useCourseSubtopics('course-1'))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.activeSubtopics.map((item) => item.id)).toEqual(['sub-2'])
    expect(result.current.archivedSubtopics.map((item) => item.id)).toEqual(['sub-1'])
    await act(async () => { expect(await result.current.addSubtopic('Nuevo')).toBe(true) })
    await waitFor(() => expect(coursesService.listSubtopics).toHaveBeenCalledTimes(2))
  })

  it('reports the server conflict detail and retains loaded data', async () => {
    vi.spyOn(coursesService, 'updateSubtopic').mockRejectedValue(new ApiError('conflict', 'Conflicto genérico', 409, { detail: 'El subtema ya tiene material y su nombre no se puede cambiar.' }))
    const { result } = renderHook(() => useCourseSubtopics('course-1'))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await act(async () => { expect(await result.current.updateSubtopic('sub-4', { name: 'Nuevo' })).toBe(false) })
    expect(result.current.mutationError).toBe('El subtema ya tiene material y su nombre no se puede cambiar.')
    expect(result.current.subtopics).toHaveLength(4)
    expect(result.current.isSubmitting).toBe(false)
  })

  it('blocks concurrent mutations and ignores results after changing courses', async () => {
    let resolve!: () => void
    vi.spyOn(coursesService, 'deleteSubtopic').mockImplementation(() => new Promise<void>((done) => { resolve = done }))
    const { result, rerender } = renderHook(({ id }) => useCourseSubtopics(id), { initialProps: { id: 'course-1' } })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    let pending!: Promise<boolean>
    act(() => { pending = result.current.deleteSubtopic('sub-4') })
    await act(async () => { expect(await result.current.deleteSubtopic('sub-4')).toBe(false) })
    expect(coursesService.deleteSubtopic).toHaveBeenCalledTimes(1)
    rerender({ id: 'course-2' })
    await act(async () => { resolve(); expect(await pending).toBe(false) })
    await waitFor(() => expect(result.current.course?.id).toBe('course-2'))
    expect(result.current.mutationError).toBeNull()
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
