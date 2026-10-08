/**
 * Simulated course indicators endpoints with sample data taken from the Figma mockups.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IndicatorsContract } from '@/services/indicators.contract'
import type { CourseIndicators } from '@/types/indicators'
import { COURSES } from './courses.mock'
import { respond } from './scenario'

/**
 * Sample indicators of the courses that already have activity.
 */
export const INDICATORS: CourseIndicators[] = [
  {
    courseId: 'course-1',
    enrolledCount: 3,
    students: [
      { studentId: 'st-1', fullName: 'Valentina Morales Rivera', initials: 'VM', answeredCount: 42, correctCount: 31 },
      { studentId: 'st-2', fullName: 'Diego Paredes Luna', initials: 'DP', answeredCount: 27, correctCount: 17 },
      { studentId: 'st-3', fullName: 'Lucía Ramos Soto', initials: 'LR', answeredCount: 0, correctCount: 0 },
    ],
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
  getIndicators: (courseId) => respond(INDICATORS.find((item) => item.courseId === courseId) ?? null),
  exportIndicators: (courseId) => {
    const code = COURSES.find((course) => course.id === courseId)?.code ?? courseId
    return respond({ fileName: `kalibra_${code}_indicadores.csv` })
  },
}
