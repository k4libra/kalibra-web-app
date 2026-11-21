/**
 * Service contract of the student monitoring feature.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { CourseGapMap, MonitoredStudent, StudentMonitoringStats, StudentProgress } from '@/types/studentMonitoring'

/** Defines the remote student monitoring operations. */
export interface StudentMonitoringServiceContract {
  /**
   * Fetches the enrollments of a course.
   *
   * @param courseId - Course whose roster is requested.
   * @returns Enrolled students, or an empty roster.
   * @throws Error when the course does not exist.
   */
  getStudentsByCourse(courseId: string, signal?: AbortSignal): Promise<MonitoredStudent[]>
  /**
   * Fetches individual progress and recommendation evidence.
   *
   * @param studentId - Stable student identity.
   * @param courseId - Enrollment context, required when the student belongs to several courses.
   * @returns Measurements and recent response evidence.
   * @throws Error when the student is unavailable.
   */
  getStudentProgress(studentId: string, courseId?: string, signal?: AbortSignal): Promise<StudentProgress>
  /**
   * Fetches global enrollment counters.
   *
   * @returns Total, active and inactive enrollment counts.
   * @throws Error when the request fails.
   */
  getStats(signal?: AbortSignal): Promise<StudentMonitoringStats>
  /**
   * Fetches the aggregate gap map.
   *
   * @param courseId - Course to measure.
   * @returns Group metrics and subtopic distributions.
   * @throws Error when the course does not exist.
   */
  getGapMap(courseId: string, signal?: AbortSignal): Promise<CourseGapMap>
}
