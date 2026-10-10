/**
 * Integrates course rosters, mastery gap maps and individual progress.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { StudentMonitoringServiceContract } from '@/services/studentMonitoring.contract'
import { apiClient } from '@/services/http/apiClient'
import { mapGap, mapProgress, mapStudent } from '@/services/mappers/monitoring.mapper'
import type { GapMapDto, IndicatorsDto, ProgressDto, RosterDto } from '@/types/api'
import { ApiError } from '@/types/apiError'
async function measurements(courseId: string, signal?: AbortSignal) {
  return Promise.all([apiClient.get<IndicatorsDto>(`/courses/${courseId}/indicators`, { signal }), apiClient.get<GapMapDto>(`/courses/${courseId}/mastery-gap-map`, { signal })])
}
/** Reads enrolled students and their actual progress measurements. */
export const studentMonitoringService: StudentMonitoringServiceContract = {
  async getStudentsByCourse(courseId, signal) {
    const [rosters, [report, gap]] = await Promise.all([apiClient.get<RosterDto[]>('/course-rosters', { signal }), measurements(courseId, signal)])
    const roster = rosters.find((item) => item.courseId === courseId)
    if (!roster) throw new ApiError('not-found', 'No se encontró el curso solicitado.', 404)
    return roster.students.map((student) => mapStudent(student, courseId, report, gap))
  },
  async getStudentProgress(studentId, courseId, signal) {
    const rosters = await apiClient.get<RosterDto[]>('/course-rosters', { signal })
    const matches = rosters.filter((roster) => (!courseId || roster.courseId === courseId) && roster.students.some((student) => student.studentId === studentId))
    if (matches.length !== 1) throw new ApiError('not-found', matches.length ? 'Selecciona el curso del estudiante desde la lista.' : 'Estudiante no encontrado.', 404)
    const roster = matches[0]
    const enrolled = roster.students.find((student) => student.studentId === studentId)!
    const [dto, [report, gap]] = await Promise.all([
      apiClient.get<ProgressDto>(`/courses/${roster.courseId}/student-progress?studentId=${encodeURIComponent(studentId)}`, { signal }), measurements(roster.courseId, signal),
    ])
    return mapProgress(dto, mapStudent(enrolled, roster.courseId, report, gap))
  },
  async getStats(signal) {
    const rosters = await apiClient.get<RosterDto[]>('/course-rosters', { signal })
    const reports = await Promise.all(rosters.map((roster) => apiClient.get<IndicatorsDto>(`/courses/${roster.courseId}/indicators`, { signal })))
    const totalStudents = rosters.reduce((sum, roster) => sum + roster.enrolledCount, 0)
    const activeStudents = reports.reduce((sum, report) => sum + report.practice.activeStudents, 0)
    return { updatedAt: '', totalStudents, activeStudents, inactiveStudents: totalStudents - activeStudents }
  },
  async getGapMap(courseId, signal) {
    const [gap, rosters] = await Promise.all([apiClient.get<GapMapDto>(`/courses/${courseId}/mastery-gap-map`, { signal }), apiClient.get<RosterDto[]>('/course-rosters', { signal })])
    return mapGap(gap, rosters.find((roster) => roster.courseId === courseId)?.enrolledCount ?? 0)
  },
}
