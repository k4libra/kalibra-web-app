
/**
 * Student monitoring service implementation.
 *
 * @remarks
 * Currently delegates operations to simulated data.
 * A future REST implementation can replace the mock
 * without changing the consuming components.
 *
 * @packageDocumentation
 */

import type {
    CourseGapMap,
    MonitoredStudent,
    StudentMonitoringStats,
    StudentProgress,
} from '@/types/studentMonitoring'

import type {
    StudentMonitoringServiceContract,
} from './studentMonitoring.contract'

import {
    getCourseGapMap,
    getStudentMonitoringStats,
    getStudentProgress,
    listMonitoredStudents,
} from '@/mocks/studentMonitoring.mock'

/**
 * Service responsible for student monitoring operations.
 */
class StudentMonitoringService
    implements StudentMonitoringServiceContract {

    /**
     * Retrieves students associated with a course.
     */
    getStudentsByCourse(
        courseId: string,
    ): Promise<MonitoredStudent[]> {
        return listMonitoredStudents(courseId)
    }

    /**
     * Retrieves individual student progress.
     */
    getStudentProgress(
        studentId: string,
    ): Promise<StudentProgress> {
        return getStudentProgress(studentId)
    }

    /**
     * Retrieves student monitoring statistics.
     */
    getStats(): Promise<StudentMonitoringStats> {
        return getStudentMonitoringStats()
    }

    /**
     * Retrieves the gap map of a selected course.
     */
    getGapMap(
        courseId: string,
    ): Promise<CourseGapMap> {
        return getCourseGapMap(courseId)
    }
}

/**
 * Shared service instance for the student monitoring feature.
 */
export const studentMonitoringService:
    StudentMonitoringServiceContract =
    new StudentMonitoringService()
