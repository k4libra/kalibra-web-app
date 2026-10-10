/**
 * Tests feature writes and enrollment context against the HTTP integration contract.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it, vi } from 'vitest'
import { coursesService } from '@/services/courses.service'
import { curricularMaterialService } from '@/services/curricularMaterial.service'
import { exercisesService } from '@/services/exercises.service'
import { invitationsService } from '@/services/invitations.service'
import { studentMonitoringService } from '@/services/studentMonitoring.service'
import { apiStub } from '@/test/apiStub'
import type { RosterDto } from '@/types/api'

function request(path: string, method: string) {
  return vi.mocked(fetch).mock.calls.find(([url, init]) => String(url) === `/api/v1${path}` && init?.method === method)![1]!
}

describe('feature HTTP contract', () => {
  it('creates only the course fields supported by the API', async () => {
    await coursesService.createCourse({ name: 'Curso nuevo', code: 'NEW', subtopics: ['Tema'] })
    expect(JSON.parse(String(request('/courses', 'POST').body))).toEqual({ name: 'Curso nuevo', code: 'NEW', subtopicNames: ['Tema'] })
  })
  it('reads and persists the workspace course on the server', async () => {
    await coursesService.getWorkspace()
    expect(await coursesService.selectActiveCourse('course-2')).toEqual({ activeCourseId: 'course-2' })
    expect(JSON.parse(String(request('/teachers/me/workspace/active-course', 'PUT').body))).toEqual({ courseId: 'course-2' })
    expect(await coursesService.getWorkspace()).toEqual({ activeCourseId: 'course-2' })
  })
  it('uploads actual bytes and the supported multipart metadata', async () => {
    const file = new File(['pdf bytes'], 'notes.pdf', { type: 'application/pdf' })
    await curricularMaterialService.upload({ courseId: 'course-2', subtopicId: 'sub-5', file })
    const init = request('/courses/course-2/curricular-materials', 'POST')
    const form = init.body as FormData
    expect(form.get('file')).toBe(file)
    expect(form.get('subtopicIds')).toBe('sub-5')
    expect(form.get('fileName')).toBe('notes.pdf')
    expect(form.get('format')).toBe('PDF')
    expect(new Headers(init.headers).has('Content-Type')).toBe(false)
  })
  it.each([true, false])('maps an upload 413 to a clear 10 MB error (JSON: %s)', async (json) => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(json ? JSON.stringify({ status: 413, detail: 'Maximum upload size exceeded' }) : 'Payload Too Large', { status: 413 }))
    await expect(curricularMaterialService.upload({ courseId: 'course-1', subtopicId: 'sub-1', file: new File(['bytes'], 'notes.pdf') }))
      .rejects.toMatchObject({ code: 'invalid-input', status: 413, message: 'El archivo supera el límite de 10 MB; el archivo no se registró.' })
  })
  it('joins roster activity dates from each student progress response in the selected course', async () => {
    const timestamp = '2026-10-10T14:30:00Z'
    apiStub.respond('/courses/course-1/student-progress', 200, { lastActivityAt: timestamp })
    const controller = new AbortController()
    const students = await studentMonitoringService.getStudentsByCourse('course-1', controller.signal)
    expect(students).toHaveLength(3)
    expect(students.every((student) => student.lastActivityAt === timestamp)).toBe(true)
    for (const student of students) {
      expect(request(`/courses/course-1/student-progress?studentId=${student.id}`, 'GET').signal).toBe(controller.signal)
    }
  })
  it('requests a generation batch with the selected real subtopic', async () => {
    await exercisesService.generate('course-1', 'sub-1')
    expect(JSON.parse(String(request('/courses/course-1/generated-exercises', 'POST').body))).toEqual({ subtopicId: 'sub-1', quantity: 10 })
  })
  it('sends invitation creation and lifecycle changes to their dedicated endpoints', async () => {
    const result = await invitationsService.sendInvitation('course-1', 'estudiante.test3@upc.edu.pe')
    expect(JSON.parse(String(request('/invitations', 'POST').body))).toEqual({ courseId: 'course-1', studentEmail: 'estudiante.test3@upc.edu.pe' })
    if (result.status !== 'sent') throw new Error('Expected a sent invitation')
    await invitationsService.cancelInvitation(result.invitation.id)
    await invitationsService.resendInvitation(result.invitation.id)
    expect(request(`/invitations/${result.invitation.id}/cancellations`, 'POST').body).toBeUndefined()
    expect(request(`/invitations/${result.invitation.id}/renewals`, 'POST').body).toBeUndefined()
  })
  it('requires enrollment context when a student belongs to several courses', async () => {
    const rosters: RosterDto[] = ['first', 'second'].map((courseId) => ({ courseId, courseName: 'Curso', courseCode: 'TEST', enrolledCount: 1, students: [{ studentId: 'student', email: 'estudiante.test1@upc.edu.pe', enrolledAt: '2026-10-10' }] }))
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(rosters)))
    await expect(studentMonitoringService.getStudentProgress('student')).rejects.toMatchObject({ message: 'Selecciona el curso del estudiante desde la lista.' })
    expect(vi.mocked(fetch).mock.calls).toHaveLength(1)
  })
})
