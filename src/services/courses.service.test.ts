/**
 * Tests for the courses service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { coursesService } from './courses.service'

describe('coursesService', () => {
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
})
