/**
 * Tests for the courses service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it, vi } from 'vitest'
import { apiStub } from '@/test/apiStub'
import { coursesService } from './courses.service'

describe('coursesService', () => {
  it('retains historical solved counts for archived subtopics from the practice report', async () => {
    apiStub.account.courses[0].subtopics[0].status = 'ARCHIVED'
    expect((await coursesService.listSubtopics('course-1', undefined, true))[0]).toMatchObject({ status: 'ARCHIVED', solvedExerciseCount: 30, approvedExerciseCount: 18 })
  })
  it('keeps the ordinary curriculum projection independent of the archive practice request', async () => {
    apiStub.respond('/courses/course-1/indicators', 503)
    expect(await coursesService.listSubtopics('course-1')).toHaveLength(4)
    expect(vi.mocked(fetch).mock.calls.some(([path]) => String(path).endsWith('/indicators'))).toBe(false)
  })
  it('lists the courses of the teacher', async () => {
    const courses = await coursesService.listCourses()
    expect(courses.length).toBeGreaterThan(0)
  })

  it('lists only the subtopics of the requested course, in order', async () => {
    const [course] = await coursesService.listCourses()
    const subtopics = await coursesService.listSubtopics(course.id)
    expect(subtopics.every((subtopic) => subtopic.courseId === course.id)).toBe(true)
    expect(subtopics.map((subtopic) => subtopic.order)).toEqual([...subtopics.map((subtopic) => subtopic.order)].sort())
  })

  it('rejects an unknown course', async () => {
    await expect(coursesService.getCourse('missing')).rejects.toThrow()
  })

  it('creates the entire draft in one POST', async () => {
    await coursesService.createCourse({ name: 'Curso nuevo', code: 'NEW', subtopics: ['Primero', 'Segundo'] })
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(fetch)).toHaveBeenCalledWith('/api/v1/courses', expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'Curso nuevo', code: 'NEW', subtopicNames: ['Primero', 'Segundo'] }) }))
  })

  it('patches course metadata and appends an active unlocked subtopic', async () => {
    expect(await coursesService.updateCourse('course-2', { name: 'Nuevo nombre', code: 'NEW' })).toMatchObject({ name: 'Nuevo nombre', code: 'NEW' })
    await coursesService.addSubtopic('course-2', 'Nuevo tema')
    expect(vi.mocked(fetch)).toHaveBeenCalledWith('/api/v1/courses/course-2', expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ name: 'Nuevo nombre', code: 'NEW' }) }))
    expect(vi.mocked(fetch)).toHaveBeenCalledWith('/api/v1/courses/course-2/subtopics', expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'Nuevo tema' }) }))
    expect((await coursesService.listSubtopics('course-2')).at(-1)).toMatchObject({ name: 'Nuevo tema', order: 5, status: 'ACTIVE', locked: false })
  })

  it('renames, reorders, archives and restores using partial payloads', async () => {
    await coursesService.updateSubtopic('course-2', 'sub-5', { name: 'Renombrado' })
    await coursesService.updateSubtopic('course-2', 'sub-5', { displayOrder: 3 })
    await coursesService.updateSubtopic('course-2', 'sub-5', { status: 'ARCHIVED' })
    expect((await coursesService.listSubtopics('course-2')).map((item) => item.id)).toEqual(['sub-6', 'sub-7', 'sub-5', 'sub-8'])
    expect(apiStub.account.courses[1].subtopics[2]).toMatchObject({ name: 'Renombrado', displayOrder: 3, status: 'ARCHIVED' })
    await coursesService.updateSubtopic('course-2', 'sub-5', { status: 'ACTIVE' })
    for (const payload of [{ name: 'Renombrado' }, { displayOrder: 3 }, { status: 'ARCHIVED' }, { status: 'ACTIVE' }])
      expect(vi.mocked(fetch)).toHaveBeenCalledWith('/api/v1/courses/course-2/subtopics/sub-5', expect.objectContaining({ method: 'PATCH', body: JSON.stringify(payload) }))
  })

  it('deletes without parsing a 204 body and leaves contiguous ordering', async () => {
    expect(await coursesService.deleteSubtopic('course-2', 'sub-6')).toBeUndefined()
    expect(vi.mocked(fetch)).toHaveBeenCalledWith('/api/v1/courses/course-2/subtopics/sub-6', expect.objectContaining({ method: 'DELETE' }))
    expect((await coursesService.listSubtopics('course-2')).map((item) => item.order)).toEqual([1, 2, 3])
  })

  it('preserves conflict details for locked and last-active mutations', async () => {
    await expect(coursesService.updateSubtopic('course-1', 'sub-1', { name: 'Cambio' })).rejects.toMatchObject({ status: 409, problem: { detail: 'El subtema ya tiene material y su nombre no se puede cambiar.' } })
    await expect(coursesService.deleteSubtopic('course-1', 'sub-1')).rejects.toMatchObject({ status: 409 })
    apiStub.account.courses[1].subtopics.slice(1).forEach((item) => { item.status = 'ARCHIVED' })
    await expect(coursesService.updateSubtopic('course-2', 'sub-5', { status: 'ARCHIVED' })).rejects.toMatchObject({ status: 409, problem: { detail: 'El curso debe conservar al menos un subtema activo.' } })
    await expect(coursesService.deleteSubtopic('course-2', 'sub-5')).rejects.toMatchObject({ status: 409 })
  })
})
