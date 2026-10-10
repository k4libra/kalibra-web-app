/**
 * Tests for material read, upload failures and stale response protection.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCurricularMaterials } from '@/hooks/useCurricularMaterials'
import { coursesService } from '@/services/courses.service'
import { curricularMaterialService } from '@/services/curricularMaterial.service'
import type { CurricularMaterial } from '@/types/curricularMaterial'
import type { CourseOverview } from '@/types/course'

function course(id: string): CourseOverview {
  return { id, name: id, code: '', term: '', faculty: '', semester: '', icon: 'school', subtopicCount: 1, materialCount: 0, approvedExerciseCount: 0, studentCount: 0, pendingInvitationCount: 0, averageMastery: null }
}
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => { resolve = done })
  return { promise, resolve }
}
const uploaded: CurricularMaterial = { id: 'material', courseId: 'a', subtopicId: 'sub', fileName: 'notes.pdf', fileType: 'pdf', fileSize: 3, status: 'processing', uploadedAt: '2026-10-10' }

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(coursesService, 'getCourse').mockImplementation(async (id) => course(id))
  vi.spyOn(coursesService, 'listSubtopics').mockResolvedValue([])
  vi.spyOn(curricularMaterialService, 'getByCourse').mockResolvedValue([])
  vi.spyOn(curricularMaterialService, 'upload').mockResolvedValue(uploaded)
})

describe('useCurricularMaterials', () => {
  it('exposes loading, empty results and a service failure', async () => {
    const { result, rerender } = renderHook(({ id }) => useCurricularMaterials(id), { initialProps: { id: 'a' } })
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.stats.total).toBe(0)
    vi.mocked(curricularMaterialService.getByCourse).mockRejectedValue(new Error('read failed'))
    rerender({ id: 'b' })
    await waitFor(() => expect(result.current.error).toBe('read failed'))
    expect(result.current.course).toBeNull()
    expect(result.current.materials).toEqual([])
  })

  it('ignores an out-of-order response from the previous course', async () => {
    const first = deferred<CurricularMaterial[]>()
    vi.mocked(curricularMaterialService.getByCourse).mockImplementation((id) => id === 'a' ? first.promise : Promise.resolve([]))
    const { result, rerender } = renderHook(({ id }) => useCurricularMaterials(id), { initialProps: { id: 'a' } })
    rerender({ id: 'b' })
    await waitFor(() => expect(result.current.course?.id).toBe('b'))
    await act(async () => first.resolve([uploaded]))
    expect(result.current.course?.id).toBe('b')
    expect(result.current.materials).toEqual([])
  })

  it('hides already-loaded material immediately on a course change', async () => {
    vi.mocked(curricularMaterialService.getByCourse).mockResolvedValueOnce([uploaded])
    const second = deferred<CurricularMaterial[]>()
    const { result, rerender } = renderHook(({ id }) => useCurricularMaterials(id), { initialProps: { id: 'a' } })
    await waitFor(() => expect(result.current.materials).toHaveLength(1))
    vi.mocked(curricularMaterialService.getByCourse).mockReturnValue(second.promise)
    rerender({ id: 'b' })
    expect(result.current.materials).toEqual([])
    expect(result.current.isLoading).toBe(true)
    await act(async () => second.resolve([]))
  })

  it('refreshes all projections after a successful upload', async () => {
    const { result } = renderHook(() => useCurricularMaterials('a'))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    vi.mocked(curricularMaterialService.getByCourse).mockResolvedValue([uploaded])
    await act(async () => { await result.current.uploadMaterial({ courseId: 'a', subtopicId: 'sub', file: new File(['pdf'], 'notes.pdf') }) })
    await waitFor(() => expect(result.current.stats.processing).toBe(1))
    expect(coursesService.listSubtopics).toHaveBeenCalledTimes(2)
    expect(result.current.isUploading).toBe(false)
  })

  it('exposes upload errors separately without rejecting the UI action', async () => {
    vi.mocked(curricularMaterialService.upload).mockRejectedValue(new Error('upload failed'))
    const { result } = renderHook(() => useCurricularMaterials('a'))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await act(async () => { expect(await result.current.uploadMaterial({ courseId: 'a', subtopicId: 'sub', file: new File(['pdf'], 'notes.pdf') })).toBeNull() })
    expect(result.current.uploadError).toBe('upload failed')
    expect(result.current.error).toBeNull()
    act(() => result.current.clearError())
    expect(result.current.uploadError).toBeNull()
  })

  it.each(['switch', 'unmount'])('ignores upload completion after %s', async (transition) => {
    const pending = deferred<CurricularMaterial>()
    vi.mocked(curricularMaterialService.upload).mockReturnValue(pending.promise)
    const { result, rerender, unmount } = renderHook(({ id }) => useCurricularMaterials(id), { initialProps: { id: 'a' } })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    let action!: Promise<CurricularMaterial | null>
    act(() => { action = result.current.uploadMaterial({ courseId: 'a', subtopicId: 'sub', file: new File(['pdf'], 'notes.pdf') }) })
    expect(result.current.isUploading).toBe(true)
    if (transition === 'switch') {
      rerender({ id: 'b' })
      await waitFor(() => expect(result.current.course?.id).toBe('b'))
    } else unmount()
    await act(async () => pending.resolve(uploaded))
    expect(await action).toBeNull()
    if (transition === 'switch') expect(result.current.materials).toEqual([])
  })
})
