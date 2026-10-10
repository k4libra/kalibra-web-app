/**
 * Tests form submission guards and stale completion handling in the material page hook.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import { act, renderHook, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider } from '@/context/ToastContext'
import { useCurricularMaterialPage } from '@/hooks/useCurricularMaterialPage'
import { coursesService } from '@/services/courses.service'
import { curricularMaterialService } from '@/services/curricularMaterial.service'
import type { CourseOverview, Subtopic } from '@/types/course'
import type { CurricularMaterial } from '@/types/curricularMaterial'

const course: CourseOverview = { id: 'course', name: 'Curso', code: 'TEST', term: '', faculty: '', semester: '', icon: 'school', subtopicCount: 1, materialCount: 0, approvedExerciseCount: 0, studentCount: 0, studentIds: [], pendingInvitationCount: 0, averageMastery: null }
const subtopic: Subtopic = { id: 'topic', courseId: course.id, name: 'Tema', order: 1, description: '', materialStatus: 'missing', approvedExerciseCount: 0, averageMastery: null }
const material: CurricularMaterial = { id: 'material', courseId: course.id, subtopicId: subtopic.id, fileName: 'notes.pdf', fileType: 'pdf', fileSize: 7, status: 'processing', uploadedAt: '2026-10-10' }

function wrapper({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(coursesService, 'getCourse').mockImplementation(async (id) => ({ ...course, id }))
  vi.spyOn(coursesService, 'listSubtopics').mockImplementation(async (id) => [{ ...subtopic, courseId: id }])
  vi.spyOn(curricularMaterialService, 'getByCourse').mockResolvedValue([])
  vi.spyOn(curricularMaterialService, 'upload').mockResolvedValue(material)
})

describe('useCurricularMaterialPage', () => {
  it('blocks submission of invalid files even when the action is called directly', async () => {
    const { result } = renderHook(() => useCurricularMaterialPage(course.id), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    act(() => result.current.openUpload())
    act(() => result.current.selectFile(new File(['word'], 'notes.docx')))
    expect(result.current.validationError?.code).toBe('UNSUPPORTED_FORMAT')
    await act(async () => { await result.current.submit() })
    expect(curricularMaterialService.upload).not.toHaveBeenCalled()
    expect(screen.queryByText('Material cargado')).not.toBeInTheDocument()
  })

  it('keeps the submitted selection stable and blocks dialog actions during upload', async () => {
    let resolve!: (value: CurricularMaterial) => void
    vi.mocked(curricularMaterialService.upload).mockReturnValue(new Promise((done) => { resolve = done }))
    const { result } = renderHook(() => useCurricularMaterialPage(course.id), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    act(() => result.current.openUpload())
    const file = new File(['content'], 'notes.pdf')
    act(() => result.current.selectFile(file))
    let submission!: Promise<void>
    act(() => { submission = result.current.submit() })
    expect(result.current.isUploading).toBe(true)
    act(() => {
      result.current.removeFile()
      result.current.selectFile(new File(['other'], 'other.pdf'))
      result.current.selectSubtopic('other-topic')
      result.current.openUpload()
      result.current.closeUpload()
    })
    expect(result.current.uploadForm?.file).toBe(file)
    expect(result.current.uploadForm?.subtopicId).toBe(subtopic.id)
    expect(result.current.isUploading).toBe(true)
    await act(async () => { resolve(material); await submission })
    expect(result.current.uploadForm).toBeNull()
    expect(screen.getByText('Material cargado')).toBeInTheDocument()
  })

  it('hides the old form and suppresses its toast after changing courses', async () => {
    let resolve!: (value: CurricularMaterial) => void
    vi.mocked(curricularMaterialService.upload).mockReturnValue(new Promise((done) => { resolve = done }))
    const { result, rerender } = renderHook(({ id }) => useCurricularMaterialPage(id), { initialProps: { id: course.id }, wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    act(() => result.current.openUpload())
    act(() => result.current.selectFile(new File(['content'], 'notes.pdf')))
    let submission!: Promise<void>
    act(() => { submission = result.current.submit() })
    rerender({ id: 'new-course' })
    expect(result.current.uploadForm).toBeNull()
    await act(async () => { resolve(material); await submission })
    expect(screen.queryByText('Material cargado')).not.toBeInTheDocument()
    expect(result.current.uploadForm).toBeNull()
  })
})
