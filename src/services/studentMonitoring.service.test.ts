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
import { apiStub } from '@/test/apiStub'
import { STUDENT_SUBTOPIC_MASTERY } from '@/test/uiFixtures'

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

  it('preserves feedback without fabricating recommendations or recent correctness', async () => {
    const progress = await resolveMock(studentMonitoringService.getStudentProgress('st-1', 'course-1'))
    expect(progress.student.id).toBe('st-1')
    expect(progress.student.lastActivityAt).toBe('2025-09-15T09:48:00')
    expect(progress.recentFeedback).toEqual(['Revisa el caso base de la recursión.'])
    expect(progress.recentResponses).toEqual([])
    expect(progress.reinforcementSubtopicIds).toEqual([])
    expect(progress.subtopics.every((item) => item.correctAnswers === null)).toBe(true)
    const inactive = await resolveMock(studentMonitoringService.getStudentProgress('st-3', 'course-1'))
    expect(inactive.student.resolvedExercises).toBe(0)
    expect(inactive.student.lastActivityAt).toBeNull()
    expect(inactive.student.enrolledAt).toBe('2025-09-04')
  })

  it('honors the teacher-empty scenario across monitoring and indicators', async () => {
    apiStub.empty()
    expect(await resolveMock(studentMonitoringService.getStats())).toMatchObject({ totalStudents: 0, activeStudents: 0, inactiveStudents: 0 })
    await expect(studentMonitoringService.getStudentsByCourse('course-1')).rejects.toMatchObject({ status: 404 })
    await expect(studentMonitoringService.getGapMap('course-1')).rejects.toMatchObject({ status: 404 })
    await expect(indicatorsService.getIndicators('course-1')).rejects.toMatchObject({ status: 404 })
    await expect(studentMonitoringService.getStudentProgress('st-1')).rejects.toThrow('Estudiante no encontrado.')
  })

  it('rejects unknown resources instead of silently returning sample data', async () => {
    await expect(studentMonitoringService.getStudentsByCourse('missing')).rejects.toThrow('No se encontró el recurso solicitado.')
    await expect(studentMonitoringService.getGapMap('missing')).rejects.toThrow('No se encontró el recurso solicitado.')
    await expect(studentMonitoringService.getStudentProgress('missing')).rejects.toThrow('Estudiante no encontrado.')
  })
})
