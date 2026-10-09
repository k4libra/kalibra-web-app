
/**
 * Service contract for student monitoring.
 *
 * @remarks
 * Defines the operations required by the student list,
 * individual progress and course gap map.
 *
 * @packageDocumentation
 */

import type {
    CourseGapMap,
    MonitoredStudent,
    StudentMonitoringStats,
    StudentProgress,
} from '@/types/studentMonitoring'

/**
 * Operations supported by the student monitoring service.
 */
export interface StudentMonitoringServiceContract {
    /**
     * Retrieves students enrolled in a course.
     *
     * @param courseId - Selected course identifier.
     * @returns Students belonging to the course.
     */
    getStudentsByCourse(
        courseId: string,
    ): Promise<MonitoredStudent[]>

    /**
     * Retrieves individual progress for a student.
     *
     * @param studentId - Selected student identifier.
     * @returns Student information and subtopic mastery.
     */
    getStudentProgress(
        studentId: string,
    ): Promise<StudentProgress>

    /**
     * Retrieves enrollment and activity statistics.
     *
     * @returns Total, active and inactive student counters.
     */
    getStats(): Promise<StudentMonitoringStats>

    /**
     * Retrieves the gap map for a course.
     *
     * @param courseId - Selected course identifier.
     * @returns Group mastery and subtopic gaps.
     */
    getGapMap(courseId: string): Promise<CourseGapMap>
}
