/**
 * Supplies a test-only fetch server with typed generic API fixtures.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { vi } from 'vitest'
import { sessionStore } from '@/services/http/sessionStore'
import { COURSES, STUDENTS, STUDENT_SUBTOPIC_MASTERY, SUBTOPICS } from '@/test/uiFixtures'
import type { CatalogDto, CourseDto, ExerciseDto, GapMapDto, IndicatorsDto, InvitationDto, MaterialDto, RosterDto, UserDto } from '@/types/api'
import type { InstitutionalIndicators } from '@/types/institutionalIndicators'

/** Generic teacher credentials from the documented seed contract. */
export const teacherCredentials = { email: 'profesor.test1@upc.edu.pe', password: '@profesortest1' }
/** Generic teacher response from the v2 API. */
export const teacherDto: UserDto = { id: 'teacher-1', email: teacherCredentials.email, firstName: 'Profesor', lastName: 'Test 1', roles: ['REGISTERED_USER', 'TEACHER'] }
/** Generic administrator response from the v2 API. */
export const adminDto: UserDto = { id: 'admin-1', email: 'admin.test1@upc.edu.pe', firstName: 'Admin', lastName: 'Test 1', roles: ['REGISTERED_USER', 'ADMINISTRATOR'] }
/** Minimal institution-wide fixture, independent of teacher access. */
export const institutionalDto: InstitutionalIndicators = {
  totals: { courses: 1, teachers: 1, enrolledStudents: 3, activeStudents: 2, totalSolved: 69, groupAccuracy: 70, groupDeltaPoints: 12, verificationApprovalRate: 90 },
  courses: [{ courseId: 'course-1', name: COURSES[0].name, code: COURSES[0].code, teacherName: 'Profesor Test 1', enrolledStudents: 3, activeStudents: 2, totalSolved: 69, groupAccuracy: 70, groupDeltaPoints: 12, verificationApprovalRate: 90 }],
}
interface Account { user: UserDto; password: string; courses: CourseDto[]; materials: MaterialDto[]; invitations: InvitationDto[]; populated: boolean; activeCourseId: string | null }
interface Override { status: number; body: unknown }
let accounts: Account[] = []
let current: Account
const overrides = new Map<string, Override>()
function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }) }
function problem(status: number) { return json({ status, title: 'API error', detail: 'Server-side explanation' }, status) }
function makeCourses(): CourseDto[] {
  return COURSES.map((course) => ({ id: course.id, name: course.name, code: course.code, createdAt: '2026-10-10T10:00:00Z', subtopics: SUBTOPICS.filter((subtopic) => subtopic.courseId === course.id).map((subtopic) => ({ id: subtopic.id, name: subtopic.name, displayOrder: subtopic.order })) }))
}
function materials(): MaterialDto[] {
  return ['recursividad.pdf', 'arboles-bst.pdf', 'programacion-dinamica.jpg'].map((fileName, index) => ({ id: `material-${index + 1}`, courseId: 'course-1', subtopicIds: [`sub-${index + 1}`], fileName, format: index === 2 ? 'JPEG' : 'PDF', status: index === 2 ? 'INGESTION_ERROR' : 'READY', failureReason: index === 2 ? 'No se pudo extraer el contenido de la imagen.' : null, uploadedAt: '2025-09-02T00:00:00Z' }))
}
function rosters(): RosterDto[] {
  return current.courses.map((course) => ({ courseId: course.id, courseName: course.name, courseCode: course.code,
    enrolledCount: current.populated && course.id === 'course-1' ? 3 : 0,
    students: current.populated && course.id === 'course-1' ? STUDENTS.map((student, index) => ({ studentId: student.id, email: student.email, firstName: 'Estudiante', lastName: `Test ${index + 1}`, enrolledAt: student.enrolledAt })) : [] }))
}
function catalogs(): CatalogDto[] {
  return current.courses.map((course) => ({ courseId: course.id, courseName: course.name, subtopics: course.subtopics.map((subtopic) => ({ subtopicId: subtopic.id, subtopicName: subtopic.name,
    generated: current.populated && ['sub-1', 'sub-2'].includes(subtopic.id) ? 20 : 0, approved: current.populated && ['sub-1', 'sub-2'].includes(subtopic.id) ? 18 : 0, discarded: current.populated && ['sub-1', 'sub-2'].includes(subtopic.id) ? 2 : 0 })) }))
}
function report(course: CourseDto): IndicatorsDto {
  const students = rosters().find((item) => item.courseId === course.id)!.students
  const active = students.length > 0
  return { courseId: course.id, hasActivity: active,
    accuracy: { groupAccuracy: active ? 70 : null, perStudent: students.map((student) => { const ui = STUDENTS.find((item) => item.id === student.studentId)!; return { ...student, correct: ui.correctAnswers ?? 0, submitted: ui.resolvedExercises, accuracy: ui.resolvedExercises ? 70 : null, hasActivity: ui.resolvedExercises > 0 } }) },
    practice: { totalSolved: active ? 69 : 0, averagePerActiveStudent: active ? 34.5 : 0, activeStudents: active ? 2 : 0, enrolledStudents: students.length, perSubtopic: course.subtopics.map((subtopic, index) => ({ subtopicId: subtopic.id, subtopicName: subtopic.name, solved: active ? [30, 23, 16, 0][index] ?? 0 : 0 })) },
    evolution: { groupInitial: active ? 40 : null, groupCurrent: active ? 56 : null, groupDeltaPoints: active ? 16 : null,
      perSubtopic: course.subtopics.map((subtopic, index) => ({ subtopicId: subtopic.id, subtopicName: subtopic.name, initialAverage: active ? [41, 46, 34, null][index] ?? null : null, currentAverage: active ? [65, 72, 31, null][index] ?? null : null, deltaPoints: active ? [24, 26, -3, null][index] ?? null : null, level: 'NO_DATA', practiced: active && index < 3 })) },
    verification: { approvalRate: active ? 90 : null, approved: active ? 36 : 0, discarded: active ? 4 : 0, perSubtopic: [] } }
}
function gap(course: CourseDto): GapMapDto {
  const roster = rosters().find((item) => item.courseId === course.id)!
  const cells = roster.students.flatMap((student) => course.subtopics.map((subtopic) => ({ ...student, subtopicId: subtopic.id,
    mastery: STUDENT_SUBTOPIC_MASTERY.find((item) => item.studentId === student.studentId && item.subtopicId === subtopic.id)?.mastery ?? null, level: 'NO_DATA' })))
  return { courseId: course.id, hasSufficientData: cells.some((cell) => cell.mastery !== null), students: cells,
    subtopics: course.subtopics.map((subtopic) => {
      const values = cells.filter((cell) => cell.subtopicId === subtopic.id).map((cell) => cell.mastery)
      const measured = values.filter((value): value is number => value !== null)
      return { subtopicId: subtopic.id, subtopicName: subtopic.name, groupMastery: measured.length ? measured.reduce((sum, value) => sum + value, 0) / measured.length : null,
        lowCount: measured.filter((value) => value < 40).length, mediumCount: measured.filter((value) => value >= 40 && value < 70).length,
        highCount: measured.filter((value) => value >= 70).length, noDataCount: values.filter((value) => value === null).length, reinforcementPriority: ['sub-3', 'sub-1', 'sub-2', 'sub-4'].indexOf(subtopic.id) + 1 }
    }) }
}
function exercise(subtopicId: string, verdict: ExerciseDto['verdict'] = 'APPROVED'): ExerciseDto {
  return { id: subtopicId === 'sub-1' ? verdict === 'APPROVED' ? 'ex-1' : 'ex-2' : 'ex-3', subtopicId, origin: 'TEACHER_REQUEST', statement: '¿Cuál es el valor retornado por fact(4)?', options: [{ key: 'A', text: '12', correct: false }, { key: 'B', text: '24', correct: true }], explanation: 'El factorial de cuatro es 24.', difficulty: 'MEDIUM', verdict, rejectionReason: verdict === 'DISCARDED' ? 'Dificultad incorrecta.' : null, generatedAt: '2026-10-10T10:00:00Z' }
}
function page<T>(items: T[], url: URL) {
  const page = Number(url.searchParams.get('page') ?? 0); const size = Number(url.searchParams.get('size') ?? 20)
  return { content: items.slice(page * size, (page + 1) * size), page, size, totalElements: items.length, totalPages: Math.ceil(items.length / size) }
}
/** Test server controls; never imported by the production application. */
export const apiStub = {
  /** Exposes the currently selected fixture account. */
  get account() { return current },
  /** Overrides one path with a status and payload until cleared. */
  respond(path: string, status: number, body: unknown = {}) { overrides.set(path, { status, body }) },
  /** Removes an override after an error/retry assertion. */
  clear(path: string) { overrides.delete(path) },
  /** Supplies a legitimate empty API account instead of a URL scenario. */
  empty() { current.courses = []; current.materials = []; current.invitations = []; current.populated = false; current.activeCourseId = null },
  /** Resets upload fixtures independently of other tests. */
  resetMaterials() { current.materials = materials() },
}
/** Installs an isolated fetch stub before each test. */
export function installApiStub() {
  overrides.clear()
  current = { user: structuredClone(teacherDto), password: teacherCredentials.password, courses: makeCourses(), materials: materials(), populated: true, activeCourseId: null,
    invitations: ['PENDING', 'EXPIRED', 'ACCEPTED'].map((status, index) => ({ id: `inv-${index + 1}`, courseId: 'course-1', invitedEmail: `estudiante.test${index + 1}@upc.edu.pe`, status: status as InvitationDto['status'], sentAt: '2025-09-03T15:12:00Z', expiresAt: '2025-09-06T15:12:00Z' })) }
  accounts = [current, { ...current, user: structuredClone(adminDto), password: '@admintest1' }, { ...current, user: { ...teacherDto, id: 'student-1', email: 'estudiante.test1@upc.edu.pe', roles: ['STUDENT'] }, password: '@estudiantetest1' }]
  sessionStore.setSession(null)
  vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    await Promise.resolve(); init?.signal?.throwIfAborted()
    const url = new URL(String(input), 'http://localhost'); const path = url.pathname.replace(/^\/api\/v1/, '')
    const method = init?.method ?? 'GET'; const body = typeof init?.body === 'string' ? JSON.parse(init.body) as Record<string, unknown> : {}
    const override = overrides.get(path)
    if (override) return json(override.body, override.status)
    if (path === '/authentication/sign-out') return new Response(null, { status: 204 })
    if (path === '/authentication/sign-up') {
      if (accounts.some((account) => account.user.email.toLowerCase() === String(body.email).trim().toLowerCase())) return problem(409)
      const user: UserDto = { id: `teacher-${accounts.length + 1}`, email: String(body.email), firstName: String(body.firstName), lastName: String(body.lastName), roles: ['REGISTERED_USER', 'TEACHER'] }
      accounts.push({ user, password: String(body.password), courses: [], materials: [], invitations: [], populated: false, activeCourseId: null })
      return json(user, 201)
    }
    if (path === '/authentication/sign-in') {
      const found = accounts.find((account) => account.user.email === body.email && account.password === body.password)
      if (!found) return problem(401)
      if (found.user.roles.includes('STUDENT')) return problem(403)
      current = found; return json(current.user)
    }
    if (path === '/users/me') return sessionStore.getSession() ? json(current.user) : problem(401)
    if (path === '/teachers/me/workspace') return json({ activeCourseId: current.activeCourseId })
    if (path === '/teachers/me/workspace/active-course') { current.activeCourseId = String(body.courseId); return json({ activeCourseId: current.activeCourseId }) }
    if (path === '/institutional-indicators') return new Headers(init?.headers).get('Accept') === 'text/csv' ? new Response('course,totalSolved\nTEST,69', { headers: { 'Content-Type': 'text/csv' } }) : json(institutionalDto)
    if (path === '/institutional-indicators/critical-subtopics') return json([{ courseId: 'course-1', courseName: COURSES[0].name, subtopicId: 'sub-3', subtopicName: 'Programación Dinámica', groupMastery: 31, lowCount: 2, mediumCount: 0, highCount: 0, noDataCount: 1 }])
    if (path === '/course-rosters') return json(rosters())
    if (path === '/course-exercise-catalogs') return json(catalogs())
    if (path === '/course-invitation-groups') return json(current.courses.map((course) => ({ courseId: course.id, courseName: course.name, courseCode: course.code, invitations: current.invitations.filter((item) => item.courseId === course.id) })))
    if (path === '/invitations' && method === 'POST') {
      if (!/^estudiante\.test\d@upc\.edu\.pe$/.test(String(body.studentEmail))) return problem(422)
      const invitation: InvitationDto = { id: `inv-${current.invitations.length + 1}`, courseId: String(body.courseId), invitedEmail: String(body.studentEmail), status: 'PENDING', sentAt: '2026-10-10T10:00:00Z', expiresAt: '2026-10-13T10:00:00Z' }
      current.invitations.push(invitation); return json(invitation, 201)
    }
    const invitationMutation = path.match(/^\/invitations\/([^/]+)\/(cancellations|renewals)$/)
    if (invitationMutation) {
      const invitation = current.invitations.find((item) => item.id === invitationMutation[1]); if (!invitation) return problem(404)
      invitation.status = invitationMutation[2] === 'cancellations' ? 'CANCELLED' : 'PENDING'; return json(invitation, 201)
    }
    if (path === '/courses' && method === 'POST') {
      const id = `course-${current.courses.length + 3}`
      const course: CourseDto = { id, name: String(body.name), code: String(body.code), createdAt: '2026-10-10T10:00:00Z', subtopics: (body.subtopicNames as string[]).map((name, index) => ({ id: `${id}-sub-${index + 1}`, name, displayOrder: index + 1 })) }
      current.courses.push(course); return json(course, 201)
    }
    if (path === '/courses') return json(current.courses)
    const match = path.match(/^\/courses\/([^/]+)(.*)$/)
    if (match) {
      const course = current.courses.find((item) => item.id === match[1]); if (!course) return problem(404)
      const endpoint = match[2]
      if (!endpoint) return json(course)
      if (endpoint === '/curricular-materials') {
        if (method === 'POST') {
          const form = init?.body as FormData; const subtopicId = String(form.get('subtopicIds'))
          if (!course.subtopics.some((item) => item.id === subtopicId)) return problem(400)
          const existing = current.materials.find((item) => item.courseId === course.id && item.subtopicIds.includes(subtopicId))
          const material: MaterialDto = { id: existing?.id ?? `material-${current.materials.length + 1}`, courseId: course.id, subtopicIds: [subtopicId], fileName: String(form.get('fileName')), format: String(form.get('format')) as MaterialDto['format'], status: 'PENDING_INGESTION', failureReason: null, uploadedAt: '2026-10-10T10:00:00Z' }
          current.materials = current.materials.filter((item) => item.id !== material.id); current.materials.push(material)
          return json(material, 201)
        }
        return json(page(current.materials.filter((item) => item.courseId === course.id), url))
      }
      if (endpoint === '/mastery-gap-map') return json(gap(course))
      if (endpoint === '/indicators') return new Headers(init?.headers).get('Accept') === 'text/csv' ? new Response('student,subtopic\nANON,TEST', { headers: { 'Content-Type': 'text/csv' } }) : json(report(course))
      if (endpoint === '/indicators/guide') return json({ entries: [{ indicator: 'ACCURACY', whatItMeasures: 'La proporción de respuestas correctas.', goodSignal: 'Un porcentaje alto.' }] })
      if (endpoint === '/generated-exercises') {
        if (method === 'POST') return json(Array.from({ length: Number(body.quantity) }, () => exercise(String(body.subtopicId))), 201)
        return json(page(current.populated && course.id === 'course-1' ? [exercise('sub-1'), exercise('sub-1', 'DISCARDED'), exercise('sub-2')] : [], url))
      }
      if (endpoint === '/student-progress') {
        const studentId = url.searchParams.get('studentId')
        if (!rosters().find((item) => item.courseId === course.id)?.students.some((item) => item.studentId === studentId)) return problem(404)
        const measured = STUDENT_SUBTOPIC_MASTERY.filter((item) => item.studentId === studentId)
        return json({ courseId: course.id, studentId, lastActivityAt: STUDENTS.find((student) => student.id === studentId)?.lastActivityAt ?? null, hasActivity: measured.some((item) => item.resolvedExercises > 0), subtopics: course.subtopics.map((subtopic) => ({ subtopicId: subtopic.id, subtopicName: subtopic.name, mastery: measured.find((item) => item.subtopicId === subtopic.id)?.mastery ?? null, level: 'NO_DATA', solvedCount: measured.find((item) => item.subtopicId === subtopic.id)?.resolvedExercises ?? 0 })), recentFeedback: measured.length ? ['Revisa el caso base de la recursión.'] : [] })
      }
    }
    throw new Error(`Unhandled API stub: ${method} ${path}`)
  }))
}
