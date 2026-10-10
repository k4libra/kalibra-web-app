/**
 * Tests for material endpoints and their shared course and subtopic projections.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { COURSES, SUBTOPICS } from '@/mocks/courses.mock'
import { resetCurricularMaterialsMock } from '@/mocks/curricularMaterial.mock'
import { coursesService } from '@/services/courses.service'
import { curricularMaterialService } from '@/services/curricularMaterial.service'
import { MATERIAL_UPLOAD_CONFIG } from '@/types/curricularMaterial'

async function settle<T>(request: Promise<T>): Promise<T> {
  await vi.runAllTimersAsync()
  return request
}

const initialCourses = structuredClone(COURSES)
const initialSubtopics = structuredClone(SUBTOPICS)

beforeEach(() => {
  COURSES.splice(0, COURSES.length, ...structuredClone(initialCourses))
  SUBTOPICS.splice(0, SUBTOPICS.length, ...structuredClone(initialSubtopics))
  vi.useFakeTimers()
  window.history.replaceState({}, '', '/')
  resetCurricularMaterialsMock()
})
afterEach(() => {
  vi.useRealTimers()
  window.history.replaceState({}, '', '/')
})

describe('curricularMaterialService', () => {
  it('returns isolated copies and matching reference counters', async () => {
    const materials = await settle(curricularMaterialService.getByCourse('course-1'))
    materials[0].status = 'error'
    expect(await settle(curricularMaterialService.getStats('course-1'))).toEqual({ total: 3, ready: 2, processing: 0, error: 1 })
    expect(await settle(curricularMaterialService.getByCourse('course-2'))).toEqual([])
  })

  it('replaces an error without increasing the course count and removes its failure metadata', async () => {
    const upload = await settle(curricularMaterialService.upload({ courseId: 'course-1', subtopicId: 'sub-3', file: new File(['pdf'], 'replacement.pdf') }))
    expect(upload).toMatchObject({ id: 'material-3', status: 'processing' })
    expect(upload.errorMessage).toBeUndefined()
    expect(upload.pageCount).toBeUndefined()
    expect(await settle(curricularMaterialService.getStats('course-1'))).toEqual({ total: 3, ready: 2, processing: 1, error: 0 })
    expect((await settle(coursesService.getCourse('course-1'))).materialCount).toBe(3)
    expect((await settle(coursesService.listSubtopics('course-1'))).find((item) => item.id === 'sub-3')?.materialStatus).toBe('processing')
  })

  it('synchronizes the first upload with courses and generation eligibility', async () => {
    await settle(curricularMaterialService.upload({ courseId: 'course-2', subtopicId: 'sub-5', file: new File(['pdf'], 'notes.pdf') }))
    expect(await settle(curricularMaterialService.getStats('course-2'))).toEqual({ total: 1, ready: 0, processing: 1, error: 0 })
    expect((await settle(coursesService.listCourses())).find((item) => item.id === 'course-2')?.materialCount).toBe(1)
    const subtopics = await settle(coursesService.listSubtopics('course-2'))
    expect(subtopics[0].materialStatus).toBe('processing')
    expect(subtopics.filter((item) => item.materialStatus === 'ready')).toEqual([])
  })

  it('supports newly created courses and their real subtopic identifiers', async () => {
    const course = await settle(coursesService.createCourse({ name: 'Curso de prueba', code: 'TEST', term: '2026-II', subtopics: ['Primer subtema'] }))
    const [subtopic] = await settle(coursesService.listSubtopics(course.id))
    expect(await settle(curricularMaterialService.getByCourse(course.id))).toEqual([])
    await settle(curricularMaterialService.upload({ courseId: course.id, subtopicId: subtopic.id, file: new File(['image'], 'notes.png') }))
    expect((await settle(coursesService.getCourse(course.id))).materialCount).toBe(1)
    expect((await settle(coursesService.listSubtopics(course.id)))[0].materialStatus).toBe('processing')
  })

  it.each(['getByCourse', 'getStats'] as const)('rejects an unknown course through %s', async (method) => {
    await expect(curricularMaterialService[method]('missing')).rejects.toThrow('El curso no existe.')
  })

  it('rejects a subtopic from another course without recording material', async () => {
    await expect(curricularMaterialService.upload({ courseId: 'course-2', subtopicId: 'sub-1', file: new File(['pdf'], 'notes.pdf') })).rejects.toThrow('no pertenece')
    expect(await settle(curricularMaterialService.getStats('course-2'))).toMatchObject({ total: 0 })
  })

  it.each(['unsupported', 'empty', 'oversized'])('rejects an %s file without recording material', async (invalid) => {
    const file = new File(invalid === 'empty' ? [] : ['content'], invalid === 'unsupported' ? 'notes.docx' : 'notes.pdf')
    if (invalid === 'oversized') Object.defineProperty(file, 'size', { value: MATERIAL_UPLOAD_CONFIG.maxFileSizeBytes + 1 })
    await expect(curricularMaterialService.upload({ courseId: 'course-2', subtopicId: 'sub-5', file })).rejects.toThrow()
    expect(await settle(curricularMaterialService.getByCourse('course-2'))).toEqual([])
  })

  it('honors the empty teacher scenario across all material and course reads', async () => {
    window.history.replaceState({}, '', '/?vacio')
    expect(await settle(curricularMaterialService.getByCourse('course-1'))).toEqual([])
    expect(await settle(curricularMaterialService.getStats('course-1'))).toMatchObject({ total: 0 })
    expect(await settle(coursesService.listCourses())).toEqual([])
    expect(await settle(coursesService.listSubtopics('course-1'))).toEqual([])
    await expect(coursesService.getCourse('course-1')).rejects.toThrow()
    await expect(curricularMaterialService.upload({ courseId: 'course-1', subtopicId: 'sub-1', file: new File(['pdf'], 'notes.pdf') })).rejects.toThrow()
  })

  it('exposes a course created by an empty teacher and supports its first upload', async () => {
    window.history.replaceState({}, '', '/?vacio')
    const course = await settle(coursesService.createCourse({ name: 'Curso nuevo', code: 'NEW-101', term: '2026-II', subtopics: ['Primer tema'] }))
    expect((await settle(coursesService.listCourses())).map((item) => item.id)).toEqual([course.id])
    const [subtopic] = await settle(coursesService.listSubtopics(course.id))
    expect(await settle(curricularMaterialService.getByCourse(course.id))).toEqual([])
    await settle(curricularMaterialService.upload({ courseId: course.id, subtopicId: subtopic.id, file: new File(['content'], 'first.pdf') }))
    expect((await settle(coursesService.getCourse(course.id))).materialCount).toBe(1)
    expect(await settle(curricularMaterialService.getStats(course.id))).toEqual({ total: 1, ready: 0, processing: 1, error: 0 })
    expect((await settle(coursesService.listSubtopics(course.id)))[0].materialStatus).toBe('processing')
  })
})
