
/**
 * Student monitoring overview page.
 *
 * @remarks
 * Lists students enrolled in the selected course,
 * using simulated monitoring data.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import {
    EmptyState,
    LoadingState,
    PageHeader,
    StatCard,
} from '@/components/ui'

import { StudentTable } from '@/components/student-monitoring'
import { useActiveCourse } from '@/context/ActiveCourseContext'
import { useCourses } from '@/hooks/useCourses'
import { studentMonitoringService } from '@/services/studentMonitoring.service'

import type { MonitoredStudent } from '@/types/studentMonitoring'

/**
 * Displays the student list for the active course.
 */
export function StudentsPage() {
    const navigate = useNavigate()
    const { courses } = useCourses()
    const { activeCourseId } = useActiveCourse()

    const courseId = activeCourseId ?? courses[0]?.id ?? ''
    const activeCourse = courses.find(
        (course) => course.id === courseId,
    )

    const [students, setStudents] = useState<MonitoredStudent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadStudents() {
            if (!courseId) {
                setStudents([])
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const result =
                    await studentMonitoringService.getStudentsByCourse(courseId)

                if (!cancelled) {
                    setStudents(result)
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
    }, [courseId])

    const activeStudents = students.filter(
        (student) => student.resolvedExercises > 0,
    ).length

    const inactiveStudents = students.length - activeStudents

    function handleViewProgress(student: MonitoredStudent) {
        navigate(`/estudiantes/${student.id}`)
    }

    return (
        <main className="flex flex-col gap-6">
            <PageHeader
                eyebrow="PANEL DOCENTE"
                title="Estudiantes"
                description={
                    activeCourse
                        ? `Consulta el progreso de los estudiantes de ${activeCourse.name}.`
                        : 'Consulta el progreso de los estudiantes de tus cursos.'
                }
            />

            {isLoading ? (
                <LoadingState label="Cargando estudiantes..." />
            ) : error ? (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {error}
                </div>
            ) : (
                <>
                    <section
                        aria-label="Resumen de estudiantes"
                        className="grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                        <StatCard
                            icon="group"
                            value={String(students.length)}
                            label="Estudiantes matriculados"
                        />

                        <StatCard
                            icon="check_circle"
                            tone="success"
                            value={String(activeStudents)}
                            label="Con actividad"
                        />

                        <StatCard
                            icon="schedule"
                            value={String(inactiveStudents)}
                            label="Sin actividad"
                        />
                    </section>

                    {students.length > 0 ? (
                        <StudentTable
                            students={students}
                            onViewProgress={handleViewProgress}
                        />
                    ) : (
                        <EmptyState
                            icon="group"
                            title="Aún no hay estudiantes matriculados"
                            description="Cuando los estudiantes se matriculen en este curso, podrás consultar su actividad y progreso desde aquí."
                        />
                    )}
                </>
            )}
        </main>
    )
}
