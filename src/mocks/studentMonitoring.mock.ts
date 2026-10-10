/**
 * Simulated student monitoring endpoints and recommendation projections.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { StudentMonitoringServiceContract } from '@/services/studentMonitoring.contract'
import type { SubtopicGap } from '@/types/studentMonitoring'
import { masteryTone } from '@/utils/mastery'
import { COURSES, SUBTOPICS } from '@/mocks/courses.mock'
import { STUDENTS, STUDENT_SUBTOPIC_MASTERY } from '@/mocks/students.fixture'
import { isEmptyScenario, respond } from '@/mocks/scenario'

/** Simulated implementation of the monitoring contract using canonical enrollments. */
export const studentMonitoringMock: StudentMonitoringServiceContract = {
  /**
   * Fetches a course roster.
   *
   * @param courseId - Course to list.
   * @returns Enrollments or an empty roster in the empty scenario.
   * @throws Error when the course does not exist.
   */
  getStudentsByCourse: (courseId) => {
    if (!COURSES.some((course) => course.id === courseId)) return Promise.reject(new Error('El curso seleccionado no existe.'))
    return respond(isEmptyScenario() ? [] : STUDENTS.filter((student) => student.courseId === courseId))
  },
  /**
   * Fetches progress with explicit recommendation evidence.
   *
   * @param studentId - Canonical or legacy student identity.
   * @returns Student measurements and recent responses.
   * @throws Error when the student is unavailable.
   */
  getStudentProgress: (studentId) => {
    const id = studentId.replace(/^student-/, 'st-')
    const student = isEmptyScenario() ? undefined : STUDENTS.find((item) => item.id === id)
    if (!student) return Promise.reject(new Error('No se encontró al estudiante.'))
    return respond({
      student,
      subtopics: STUDENT_SUBTOPIC_MASTERY.filter((item) => item.studentId === id),
      recentResponses: id === 'st-1' ? [
        { subtopicId: 'sub-3', isCorrect: false },
        { subtopicId: 'sub-3', isCorrect: false },
        { subtopicId: 'sub-3', isCorrect: false },
      ] : [],
      reinforcementSubtopicIds: id === 'st-1' ? ['sub-3'] : id === 'st-2' ? ['sub-3', 'sub-1'] : [],
    })
  },
  /**
   * Fetches the global enrollment summary.
   *
   * @returns Total, active and inactive counts.
   * @throws Error when the simulated request fails.
   */
  getStats: () => {
    const students = isEmptyScenario() ? [] : STUDENTS
    const activeStudents = students.filter((student) => student.resolvedExercises > 0).length
    return respond({ updatedAt: '2025-09-15T10:15:00', totalStudents: students.length, activeStudents, inactiveStudents: students.length - activeStudents })
  },
  /**
   * Fetches distributions classified by the shared mastery rule.
   *
   * @param courseId - Course to measure.
   * @returns Group metrics and distributions, including students without practice.
   * @throws Error when the course does not exist.
   */
  getGapMap: (courseId) => {
    const course = COURSES.find((item) => item.id === courseId)
    if (!course) return Promise.reject(new Error('El curso seleccionado no existe.'))
    const students = isEmptyScenario() ? [] : STUDENTS.filter((student) => student.courseId === courseId)
    const subtopics = SUBTOPICS.filter((subtopic) => subtopic.courseId === courseId).map<SubtopicGap>((subtopic) => {
      const tones = students.map((student) => masteryTone(STUDENT_SUBTOPIC_MASTERY.find((record) => record.studentId === student.id && record.subtopicId === subtopic.id)?.mastery ?? null))
      const highMasteryCount = tones.filter((tone) => tone === 'success').length
      const mediumMasteryCount = tones.filter((tone) => tone === 'warning').length
      const lowMasteryCount = tones.filter((tone) => tone === 'danger').length
      const studentsWithActivity = highMasteryCount + mediumMasteryCount + lowMasteryCount
      return { subtopicId: subtopic.id, averageMastery: studentsWithActivity ? subtopic.averageMastery : null,
        highMasteryCount, mediumMasteryCount, lowMasteryCount, noDataCount: students.length - studentsWithActivity, studentsWithActivity }
    })
    const weakest = subtopics.filter((item) => item.averageMastery !== null).sort((a, b) => a.averageMastery! - b.averageMastery!)[0]
    return respond({ courseId, updatedAt: '2025-09-15T10:15:00', subtopics, stats: {
      averageMastery: students.some((student) => student.resolvedExercises > 0) ? course.averageMastery : null,
      weakestSubtopicId: weakest?.subtopicId ?? null,
      activeStudents: students.filter((student) => student.resolvedExercises > 0).length,
      totalStudents: students.length,
    } })
  },
}
