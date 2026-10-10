/**
 * Simulated course indicators endpoints with sample data taken from the Figma mockups.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IndicatorsContract } from '@/services/indicators.contract'
import type { CourseIndicators } from '@/types/indicators'
import { COURSES } from '@/mocks/courses.mock'
import { isEmptyScenario, respond } from '@/mocks/scenario'
import { STUDENTS } from '@/mocks/students.fixture'

/**
 * Sample indicators of the courses that already have activity.
 */
export const INDICATORS: CourseIndicators[] = [
  {
    courseId: 'course-1',
    enrolledCount: STUDENTS.filter((student) => student.courseId === 'course-1').length,
    students: STUDENTS.filter((student) => student.courseId === 'course-1').map((student) => ({
      studentId: student.id, fullName: student.fullName, initials: student.initials,
      answeredCount: student.resolvedExercises, correctCount: student.correctAnswers,
    })),
    subtopics: [
      { subtopicId: 'sub-1', subtopicName: 'Recursividad y Backtracking', solvedCount: 30, initialMastery: 41, currentMastery: 65, generatedCount: 20, approvedCount: 18 },
      { subtopicId: 'sub-2', subtopicName: 'Árboles Binarios de Búsqueda', solvedCount: 23, initialMastery: 46, currentMastery: 72, generatedCount: 20, approvedCount: 18 },
      { subtopicId: 'sub-3', subtopicName: 'Programación Dinámica', solvedCount: 16, initialMastery: 34, currentMastery: 31, generatedCount: 0, approvedCount: 0 },
      { subtopicId: 'sub-4', subtopicName: 'Grafos y Caminos Mínimos', solvedCount: 0, initialMastery: null, currentMastery: null, generatedCount: 0, approvedCount: 0 },
    ],
  },
]

/**
 * Simulated implementation of {@link IndicatorsContract}.
 */
export const indicatorsMock: IndicatorsContract = {
  getIndicators: (courseId) => respond(isEmptyScenario() ? null : INDICATORS.find((item) => item.courseId === courseId) ?? null),
  exportIndicators: (courseId) => {
    const code = COURSES.find((course) => course.id === courseId)?.code ?? courseId
    return respond({ fileName: `kalibra_${code}_indicadores.csv` })
  },
}
