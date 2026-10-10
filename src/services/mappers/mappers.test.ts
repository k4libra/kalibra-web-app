/**
 * Tests pure DTO adaptation and missing-data semantics across feature models.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { mapTeacher, mapUser, profileName } from '@/services/mappers/auth.mapper'
import { average, mapCourse, mapSubtopics } from '@/services/mappers/courses.mapper'
import { mapMaterial } from '@/services/mappers/material.mapper'
import { mapCatalog, mapExercise } from '@/services/mappers/exercises.mapper'
import { mapIndicatorGuide, mapIndicators } from '@/services/mappers/indicators.mapper'
import { mapInstitutionalIndicators } from '@/services/mappers/institutional.mapper'
import { mapInvitation } from '@/services/mappers/invitations.mapper'
import { mapGap, mapProgress, mapStudent } from '@/services/mappers/monitoring.mapper'
import { adminDto, institutionalDto, teacherDto } from '@/test/apiStub'
import type { CatalogDto, CourseDto, ExerciseDto, GapMapDto, IndicatorsDto, MaterialDto, RosterDto } from '@/types/api'

const course: CourseDto = { id: 'course', name: 'Curso', code: 'TEST', createdAt: '2026-10-10', subtopics: [{ id: 'topic', name: 'Tema', displayOrder: 1 }] }
const material: MaterialDto = { id: 'material', courseId: course.id, subtopicIds: ['topic', 'other'], fileName: 'notes.jpg', format: 'JPEG', uploadedAt: '2026-10-10', status: 'INGESTION_ERROR', failureReason: 'Ingestión fallida.' }
const catalog: CatalogDto = { courseId: course.id, courseName: course.name, subtopics: [{ subtopicId: 'topic', subtopicName: 'Tema', generated: 9, approved: 7, discarded: 2 }] }
const roster: RosterDto = { courseId: course.id, courseName: course.name, courseCode: course.code, enrolledCount: 1, students: [{ studentId: 'student', email: 'estudiante.test1@upc.edu.pe', enrolledAt: '2026-10-10' }] }
const gap: GapMapDto = { courseId: course.id, hasSufficientData: true, students: [{ studentId: 'student', email: roster.students[0].email, subtopicId: 'topic', mastery: 30, level: 'LOW' }], subtopics: [{ subtopicId: 'topic', subtopicName: 'Tema', groupMastery: 30, lowCount: 1, mediumCount: 0, highCount: 0, noDataCount: 0, reinforcementPriority: 1 }] }
const report: IndicatorsDto = {
  courseId: course.id, hasActivity: true,
  accuracy: { groupAccuracy: 80, perStudent: [{ studentId: 'student', email: roster.students[0].email, correct: 4, submitted: 5, accuracy: 80, hasActivity: true }] },
  practice: { enrolledStudents: 1, activeStudents: 1, totalSolved: 5, averagePerActiveStudent: 5, perSubtopic: [{ subtopicId: 'topic', subtopicName: 'Tema', solved: 5 }] },
  evolution: { groupInitial: 40, groupCurrent: 30, groupDeltaPoints: -10, perSubtopic: [{ subtopicId: 'topic', subtopicName: 'Tema', initialAverage: 40, currentAverage: 30, deltaPoints: -10, level: 'LOW', practiced: true }] },
  verification: { approvalRate: 77.8, approved: 7, discarded: 2, perSubtopic: [{ subtopicId: 'topic', subtopicName: 'Tema', approvalRate: 77.8 }] },
}
const exercise: ExerciseDto = { id: 'question', subtopicId: 'topic', origin: 'TEACHER_REQUEST', statement: 'Pregunta', explanation: 'Explicación', options: [{ key: 'A', text: 'Respuesta', correct: true }], difficulty: 'MEDIUM', verdict: 'DISCARDED', rejectionReason: null, generatedAt: '2026-10-10T10:00:00Z' }

describe('DTO mappers', () => {
  it('distinguishes unmeasured institutional accuracy from genuine zero accuracy', () => {
    const dto = { ...institutionalDto, totals: { ...institutionalDto.totals, totalSolved: 0, groupAccuracy: 0, groupDeltaPoints: 0 }, courses: [{ ...institutionalDto.courses[0], hasActivity: false, totalSolved: 0, groupAccuracy: 0, groupDeltaPoints: 0 }] }
    expect(mapInstitutionalIndicators(dto)).toMatchObject({ totals: { groupAccuracy: null, groupDeltaPoints: null }, courses: [{ groupAccuracy: null, groupDeltaPoints: null }] })
    expect(dto.courses[0].groupAccuracy).toBe(0)
    expect(mapInstitutionalIndicators({ ...institutionalDto, courses: [{ ...institutionalDto.courses[0], totalSolved: 1, groupAccuracy: 0 }] }).courses[0].groupAccuracy).toBe(0)
  })
  it('localizes reordered official guide entries by indicator identity', () => {
    const dto = { entries: [{ indicator: 'VERIFICATION_APPROVAL', whatItMeasures: 'English verification', goodSignal: 'High' }, { indicator: 'ACCURACY', whatItMeasures: 'English accuracy', goodSignal: 'High' }] }
    const result = mapIndicatorGuide(dto)
    expect(result.entries[0].whatItMeasures).toContain('IA')
    expect(result.entries[1].whatItMeasures).toContain('respuestas')
    expect(dto.entries[0].whatItMeasures).toBe('English verification')
  })
  it('prioritizes the administrator role and never fabricates a credential or teacher role', () => {
    expect(mapUser({ ...adminDto, roles: ['TEACHER', 'ADMINISTRATOR'] }).user.role).toBe('ADMINISTRATOR')
    expect(mapUser({ ...teacherDto, roles: ['STUDENT'] }).user.role).toBe('STUDENT')
    expect(mapUser(teacherDto)).not.toHaveProperty('accessToken')
    expect(profileName({ email: 'real@example.edu' })).toBe('real@example.edu')
    expect(mapTeacher(teacherDto)).toMatchObject({ fullName: 'Profesor Test 1', initials: 'PT' })
  })
  it('derives counts from actual related resources and leaves academic metadata neutral', () => {
    const result = mapCourse(course, [material], roster, catalog, { courseId: course.id, courseName: course.name, courseCode: course.code, invitations: [] }, gap)
    expect(result).toMatchObject({ term: '', faculty: '', semester: '', icon: 'school', studentCount: 1, subtopicCount: 1, materialCount: 1, approvedExerciseCount: 7, averageMastery: 30 })
    expect(average([null, 20, 40])).toBe(30)
    expect(average([null])).toBeNull()
  })
  it('uses latest ingestion status without mutating the ordered curriculum DTO', () => {
    const latest = { ...material, uploadedAt: '2026-10-11', status: 'READY' as const }
    expect(mapSubtopics(course, [material, latest], catalog, gap)[0]).toMatchObject({ materialStatus: 'ready', approvedExerciseCount: 7, averageMastery: 30, description: '' })
    expect(course.subtopics[0].displayOrder).toBe(1)
  })
  it('keeps all material associations and omits unsupported file size, pages and scan metadata', () => {
    const result = mapMaterial(material)
    expect(result).toMatchObject({ subtopicIds: ['topic', 'other'], fileType: 'jpg', status: 'error', errorMessage: material.failureReason })
    expect(result).not.toHaveProperty('fileSize')
    expect(result).not.toHaveProperty('pageCount')
    expect(result).not.toHaveProperty('isScan')
  })
  it('keeps the actual exercise verdict and does not fabricate code, anchoring or verification checks', () => {
    const result = mapExercise(exercise)
    expect(result).toMatchObject({ code: '', sourceMaterial: '', status: 'discarded', explanation: 'Explicación' })
    expect(result.checks).toHaveLength(1)
    expect(result.checks[0]).toMatchObject({ passed: false, detail: 'El servicio no proporcionó el motivo del descarte.' })
    expect(mapCatalog(catalog, [exercise]).subtopics[0]).toMatchObject({ generatedCount: 9, approvedCount: 7, discardedCount: 2 })
  })
  it('keeps no-activity reports empty and preserves authoritative totals and verification counts', () => {
    expect(mapIndicators({ ...report, hasActivity: false }, catalog)).toBeNull()
    const result = mapIndicators(report, catalog)!
    expect(result.subtopics[0]).toMatchObject({ generatedCount: 9, approvedCount: 7, deltaPoints: -10 })
    expect(result.summary).toMatchObject({ groupDeltaPoints: -10, groupAccuracy: 80, approvalRate: 77.8 })
    expect(mapIndicators(report)?.subtopics[0].generatedCount).toBe(0)
  })
  it('maps invitation timestamps and server lifecycle without applying a local expiry scenario', () => {
    expect(mapInvitation({ id: 'invitation', courseId: 'course', invitedEmail: roster.students[0].email, status: 'PENDING', sentAt: '2026-10-10T10:00:00Z', expiresAt: '2026-10-13T10:00:00Z' })).toMatchObject({ status: 'pending', email: roster.students[0].email })
  })
  it('preserves feedback and omits unsupported response correctness, activity timestamps and recommendations', () => {
    const student = mapStudent(roster.students[0], course.id, report, gap)
    expect(student).toMatchObject({ averageMastery: 30, correctAnswers: 4, resolvedExercises: 5, lastActivityAt: null })
    const progress = mapProgress({ courseId: course.id, studentId: student.id, hasActivity: true, subtopics: [{ subtopicId: 'topic', subtopicName: 'Tema', mastery: 30, level: 'LOW', solvedCount: 5 }], recentFeedback: ['Retroalimentación real'] }, student)
    expect(progress).toMatchObject({ recentResponses: [], reinforcementSubtopicIds: [], recentFeedback: ['Retroalimentación real'] })
    expect(progress.subtopics[0].correctAnswers).toBeNull()
  })
  it('counts active student identities once and treats unmeasured subtopics as null', () => {
    const result = mapGap({ ...gap, students: [...gap.students, { ...gap.students[0], subtopicId: 'other' }], subtopics: [{ ...gap.subtopics[0], groupMastery: 0, lowCount: 0, noDataCount: 1 }] }, 1)
    expect(result.stats.activeStudents).toBe(1)
    expect(result.subtopics[0].averageMastery).toBeNull()
    expect(result.updatedAt).toBe('')
  })
})
