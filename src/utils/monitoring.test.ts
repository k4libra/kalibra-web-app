/**
 * Tests for monitoring formatting and evidence-based recommendations.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { formatMastery, formatMonitoringActivity, formatMonitoringDate, reinforcementNotice } from '@/utils/monitoring'
import type { StudentProgress } from '@/types/studentMonitoring'
import { STUDENTS, STUDENT_SUBTOPIC_MASTERY } from '@/mocks/students.fixture'
import { SUBTOPICS } from '@/mocks/courses.mock'

function progress(): StudentProgress {
  return { student: STUDENTS[0], subtopics: STUDENT_SUBTOPIC_MASTERY.filter((item) => item.studentId === 'st-1'), recentResponses: [], reinforcementSubtopicIds: ['sub-3'] }
}

describe('monitoring formatters', () => {
  it('formats enrollment dates and falls back for invalid input', () => {
    expect(formatMonitoringDate('2025-09-04')).toBe('04 sep 2025')
    expect(formatMonitoringDate('invalid')).toBe('invalid')
  })
  it('uses the snapshot rather than the real clock for activity labels', () => {
    expect(formatMonitoringActivity('2025-09-15T09:48:00', '2025-09-15T10:15:00')).toBe('Hoy, 09:48')
    expect(formatMonitoringActivity('2025-09-14T18:20:00', '2025-09-15T10:15:00')).toBe('Ayer, 18:20')
    expect(formatMonitoringActivity('2025-09-04T12:00:00', '2025-09-15T10:15:00')).toBe('04 sep 2025, 12:00')
    expect(formatMonitoringActivity(null, '2025-09-15T10:15:00')).toBe('Sin actividad')
  })
  it('distinguishes no data from a zero percentage', () => {
    expect(formatMastery(null)).toBe('—')
    expect(formatMastery(0)).toBe('0%')
    expect(formatMastery(62.4)).toBe('62%')
  })
  it('only claims three incorrect responses when the endpoint provides three matching responses', () => {
    const data = progress()
    expect(reinforcementNotice(data, SUBTOPICS)).toBe('Refuerzo sugerido: Programación Dinámica (33%).')
    data.recentResponses = Array.from({ length: 3 }, () => ({ subtopicId: 'sub-3', isCorrect: false }))
    expect(reinforcementNotice(data, SUBTOPICS)).toContain('Sus últimas 3 respuestas en este subtema fueron incorrectas.')
    data.recentResponses[0].isCorrect = true
    expect(reinforcementNotice(data, SUBTOPICS)).not.toContain('últimas 3')
  })
  it('renders both recommended subtopics and omits unknown recommendations', () => {
    const data = progress()
    data.reinforcementSubtopicIds = ['sub-3', 'sub-1', 'missing']
    expect(reinforcementNotice(data, SUBTOPICS)).toBe('Refuerzo sugerido: Programación Dinámica (33%) y Recursividad y Backtracking (72%).')
    data.reinforcementSubtopicIds = ['missing']
    expect(reinforcementNotice(data, SUBTOPICS)).toBeNull()
  })
})
