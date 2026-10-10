/**
 * Behavior tests for the monitoring service and shared student projections.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { studentMonitoringService } from '@/services/studentMonitoring.service'
import { indicatorsService } from '@/services/indicators.service'
import { invitationsService } from '@/services/invitations.service'
import { STUDENT_SUBTOPIC_MASTERY } from '@/mocks/students.fixture'

async function resolveMock<T>(promise: Promise<T>): Promise<T> {
  await vi.runAllTimersAsync()
  return promise
}

beforeEach(() => { vi.useFakeTimers(); window.history.replaceState({}, '', '/') })
afterEach(() => { vi.useRealTimers(); window.history.replaceState({}, '', '/') })

describe('studentMonitoringService', () => {
  it('shares student identities and counters with indicators and accepted invitations', async () => {
    const students = await resolveMock(studentMonitoringService.getStudentsByCourse('course-1'))
    const indicators = await resolveMock(indicatorsService.getIndicators('course-1'))
    const invitations = await resolveMock(invitationsService.listInvitations())
    expect(indicators?.students).toEqual(students.map((student) => ({ studentId: student.id, fullName: student.fullName, initials: student.initials, answeredCount: student.resolvedExercises, correctCount: student.correctAnswers })))
    expect(invitations.find((item) => item.status === 'accepted')).toMatchObject({ courseId: students[2].courseId, email: students[2].email })
  })

  it('returns global 3/2/1 counts and a course without enrollments', async () => {
    expect(await resolveMock(studentMonitoringService.getStats())).toMatchObject({ totalStudents: 3, activeStudents: 2, inactiveStudents: 1 })
    expect(await resolveMock(studentMonitoringService.getStudentsByCourse('course-2'))).toEqual([])
  })

  it('preserves sample group metrics and accounts for every enrollment in each distribution', async () => {
    const map = await resolveMock(studentMonitoringService.getGapMap('course-1'))
    expect(map.stats).toEqual({ averageMastery: 56, weakestSubtopicId: 'sub-3', activeStudents: 2, totalStudents: 3 })
    expect(map.subtopics.find((item) => item.subtopicId === 'sub-3')).toMatchObject({ averageMastery: 31, lowMasteryCount: 2, noDataCount: 1 })
    for (const topic of map.subtopics) expect(topic.lowMasteryCount + topic.mediumMasteryCount + topic.highMasteryCount + topic.noDataCount).toBe(3)
  })

  it.each([[null, 'noDataCount'], [39, 'lowMasteryCount'], [40, 'mediumMasteryCount'], [69, 'mediumMasteryCount'], [70, 'highMasteryCount'], [71, 'highMasteryCount']] as const)('classifies %s using the canonical distribution boundary', async (mastery, field) => {
    const record = STUDENT_SUBTOPIC_MASTERY[0]
    const previous = record.mastery
    try {
      record.mastery = mastery
      const map = await resolveMock(studentMonitoringService.getGapMap('course-1'))
      const topic = map.subtopics.find((item) => item.subtopicId === 'sub-1')!
      expect(topic[field]).toBe(field === 'mediumMasteryCount' || field === 'noDataCount' ? 2 : 1)
    } finally { record.mastery = previous }
  })

  it('provides legitimate recommendation evidence and keeps legacy progress links working', async () => {
    const valentina = await resolveMock(studentMonitoringService.getStudentProgress('student-1'))
    expect(valentina.student.id).toBe('st-1')
    expect(valentina.recentResponses).toEqual(Array.from({ length: 3 }, () => ({ subtopicId: 'sub-3', isCorrect: false })))
    const diego = await resolveMock(studentMonitoringService.getStudentProgress('st-2'))
    expect(diego.reinforcementSubtopicIds).toEqual(['sub-3', 'sub-1'])
    const lucia = await resolveMock(studentMonitoringService.getStudentProgress('st-3'))
    expect(lucia.student.resolvedExercises).toBe(0)
    expect(lucia.student.enrolledAt).toBe('2025-09-04')
  })

  it('honors the teacher-empty scenario across monitoring and indicators', async () => {
    window.history.replaceState({}, '', '/?vacio')
    expect(await resolveMock(studentMonitoringService.getStats())).toMatchObject({ totalStudents: 0, activeStudents: 0, inactiveStudents: 0 })
    expect(await resolveMock(studentMonitoringService.getStudentsByCourse('course-1'))).toEqual([])
    expect(await resolveMock(studentMonitoringService.getGapMap('course-1'))).toMatchObject({ stats: { averageMastery: null, activeStudents: 0 } })
    expect(await resolveMock(indicatorsService.getIndicators('course-1'))).toBeNull()
    await expect(studentMonitoringService.getStudentProgress('st-1')).rejects.toThrow('No se encontró al estudiante.')
  })

  it('rejects unknown resources instead of silently returning sample data', async () => {
    await expect(studentMonitoringService.getStudentsByCourse('missing')).rejects.toThrow('El curso seleccionado no existe.')
    await expect(studentMonitoringService.getGapMap('missing')).rejects.toThrow('El curso seleccionado no existe.')
    await expect(studentMonitoringService.getStudentProgress('missing')).rejects.toThrow('No se encontró al estudiante.')
  })
})
