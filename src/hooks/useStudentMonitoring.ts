
/**
 * React hooks for student monitoring.
 *
 * @remarks
 * Connects the student monitoring service with
 * the student list, individual progress and gap map.
 *
 * Currently uses simulated data.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react'

import { studentMonitoringService } from '@/services/studentMonitoring.service'

import type {
    CourseGapMap,
    MonitoredStudent,
    StudentMonitoringStats,
    StudentProgress,
} from '@/types/studentMonitoring'

/**
 * Loads all monitored students and their statistics.
 */
export function useMonitoredStudents() {
    const [students, setStudents] = useState<MonitoredStudent[]>([])
    const [stats, setStats] = useState<StudentMonitoringStats>({
        totalStudents: 0,
        activeStudents: 0,
        inactiveStudents: 0,
    })

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadStudents() {
            setIsLoading(true)
            setError(null)

            try {
                const statistics = await studentMonitoringService.getStats()

                if (!cancelled) {
                    setStats(statistics)
                }
            } catch (caughtError) {
                if (!cancelled) {
                    setError(
                        caughtError instanceof Error
                            ? caughtError.message
                            : 'No se pudieron cargar los estudiantes.',
                    )
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        void loadStudents()

        return () => {
            cancelled = true
        }
    }, [])

    /**
     * Retrieves students belonging to a selected course.
     */
    async function getStudentsByCourse(
        courseId: string,
    ): Promise<MonitoredStudent[]> {
        return studentMonitoringService.getStudentsByCourse(courseId)
    }

    return {
        students,
        setStudents,
        stats,
        isLoading,
        error,
        getStudentsByCourse,
    }
}

/**
 * Loads the progress of an individual student.
 *
 * @param studentId - Selected student identifier.
 */
export function useStudentProgress(studentId: string) {
    const [progress, setProgress] = useState<StudentProgress | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadProgress() {
            if (!studentId) {
                setProgress(null)
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setError(null)
            setProgress(null)

            try {
                const result =
                    await studentMonitoringService.getStudentProgress(studentId)

                if (!cancelled) {
                    setProgress(result)
                }
            } catch (caughtError) {
                if (!cancelled) {
                    setError(
                        caughtError instanceof Error
                            ? caughtError.message
                            : 'No se pudo cargar el progreso del estudiante.',
                    )
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        void loadProgress()

        return () => {
            cancelled = true
        }
    }, [studentId])

    return {
        progress,
        isLoading,
        error,
    }
}

/**
 * Loads the gap map of a selected course.
 *
 * @param courseId - Selected course identifier.
 */
export function useCourseGapMap(courseId: string) {
    const [gapMap, setGapMap] = useState<CourseGapMap | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadGapMap() {
            if (!courseId) {
                setGapMap(null)
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setError(null)
            setGapMap(null)

            try {
                const result = await studentMonitoringService.getGapMap(courseId)

                if (!cancelled) {
                    setGapMap(result)
                }
            } catch (caughtError) {
                if (!cancelled) {
                    setError(
                        caughtError instanceof Error
                            ? caughtError.message
                            : 'No se pudo cargar el mapa de brechas.',
                    )
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        void loadGapMap()

        return () => {
            cancelled = true
        }
    }, [courseId])

    return {
        gapMap,
        isLoading,
        error,
    }
}
