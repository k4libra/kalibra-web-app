/**
 * Maps enrollment, mastery distributions and individual feedback from progress endpoints.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { GapMapDto, IndicatorsDto, ProgressDto, RosterStudentDto } from '@/types/api'
import type { CourseGapMap, MonitoredStudent, StudentProgress } from '@/types/studentMonitoring'
import { initials, profileName } from '@/services/mappers/auth.mapper'
import { average } from '@/services/mappers/courses.mapper'
/** Joins enrollment identity with measured answer counts and mastery cells. */
export function mapStudent(dto: RosterStudentDto, courseId: string, report: IndicatorsDto, gap: GapMapDto): MonitoredStudent {
  const answers = report.accuracy.perStudent.find((item) => item.studentId === dto.studentId)
  const fullName = profileName(dto)
  return { id: dto.studentId, courseId, fullName, email: dto.email, initials: initials(fullName), enrolledAt: dto.enrolledAt,
    resolvedExercises: answers?.submitted ?? 0, correctAnswers: answers?.correct ?? 0,
    averageMastery: average(gap.students.filter((cell) => cell.studentId === dto.studentId).map((cell) => cell.mastery)), lastActivityAt: null }
}
/** Preserves feedback text; absent correctness and recommendations remain unavailable. */
export function mapProgress(dto: ProgressDto, student: MonitoredStudent): StudentProgress {
  return { student: { ...student, resolvedExercises: dto.subtopics.reduce((sum, item) => sum + item.solvedCount, 0), averageMastery: average(dto.subtopics.map((item) => item.mastery)) },
    subtopics: dto.subtopics.map((item) => ({ studentId: dto.studentId, subtopicId: item.subtopicId, mastery: item.mastery, resolvedExercises: item.solvedCount, correctAnswers: null })),
    recentResponses: [], reinforcementSubtopicIds: [], recentFeedback: dto.recentFeedback }
}
/** Uses API distributions and counts each active identity once. */
export function mapGap(dto: GapMapDto, totalStudents: number): CourseGapMap {
  const measured = dto.students.filter((item) => item.mastery !== null)
  const weakest = [...dto.subtopics].filter((item) => item.lowCount + item.mediumCount + item.highCount > 0).sort((a, b) => a.reinforcementPriority - b.reinforcementPriority)[0]
  return { courseId: dto.courseId, updatedAt: '', stats: { averageMastery: average(measured.map((item) => item.mastery)),
    weakestSubtopicId: weakest?.subtopicId ?? null, activeStudents: new Set(measured.map((item) => item.studentId)).size, totalStudents },
    subtopics: dto.subtopics.map((item) => ({ subtopicId: item.subtopicId,
      averageMastery: item.lowCount + item.mediumCount + item.highCount > 0 ? item.groupMastery : null,
      highMasteryCount: item.highCount, mediumMasteryCount: item.mediumCount, lowMasteryCount: item.lowCount, noDataCount: item.noDataCount,
      studentsWithActivity: item.lowCount + item.mediumCount + item.highCount })) }
}
