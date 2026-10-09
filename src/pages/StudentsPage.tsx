
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { StudentTable } from '@/components/student-monitoring/StudentTable'
import { COURSES } from '@/mocks/courses.mock'
import { studentMonitoringService } from '@/services/studentMonitoring.service'

import type { MonitoredStudent } from '@/types/studentMonitoring'

export function StudentsPage() {
    const navigate = useNavigate()

    const [courseId, setCourseId] = useState(
        COURSES[0]?.id ?? '',
    )

    const [students, setStudents] = useState<MonitoredStudent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadStudents() {
            setIsLoading(true)
            setError(null)
            setStudents([])

            try {
                const result =
                    await studentMonitoringService.getStudentsByCourse(courseId)

                if (!cancelled) {
                    setStudents(result)
                }
            } catch {
                if (!cancelled) {
                    setError('No se pudo cargar la lista de estudiantes.')
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        if (courseId) {
            void loadStudents()
        } else {
            setStudents([])
            setIsLoading(false)
        }

        return () => {
            cancelled = true
        }
    }, [courseId])

    const course = COURSES.find((item) => item.id === courseId)

    const totalStudents = students.length

    const activeStudents = students.filter(
        (student) => student.resolvedExercises > 0,
    ).length

    const studentsWithMastery = students.filter(
        (student) => student.averageMastery !== null,
    )

    const averageMastery =
        studentsWithMastery.length > 0
            ? Math.round(
                studentsWithMastery.reduce(
                    (total, student) =>
                        total + (student.averageMastery ?? 0),
                    0,
                ) / studentsWithMastery.length,
            )
            : null

    return (
        <main className="flex flex-col gap-5 p-6">
            {/* Encabezado */}
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.02em] text-[#60657A]">
                        Mis cursos › {course?.name ?? 'Curso'}
                    </p>

                    <h1 className="mt-1 text-[22px] font-bold leading-tight text-[#141A33]">
                        Estudiantes
                    </h1>

                    <p className="mt-1 text-[11px] text-[#60657A]">
                        Consulta el progreso y dominio estimado de los
                        estudiantes de tu curso.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate(`/cursos/${courseId}/brechas`)}
                    disabled={!courseId}
                    className="inline-flex items-center gap-2 rounded-[9px] bg-[#E4E8FF] px-4 py-[10px] text-[11px] font-semibold text-[#303A65] transition-colors hover:bg-[#D5DCFF] disabled:opacity-50"
                >
                    <span aria-hidden="true">▦</span>
                    Ver mapa de brechas
                </button>
            </header>

            {/* Selector de curso */}
            <section className="flex flex-wrap items-center gap-3 rounded-[13px] bg-white px-5 py-4">
                <label
                    htmlFor="monitoring-course"
                    className="text-[11px] font-semibold text-[#141A33]"
                >
                    Curso
                </label>

                <select
                    id="monitoring-course"
                    value={courseId}
                    onChange={(event) => setCourseId(event.target.value)}
                    className="min-w-[220px] max-w-full rounded-[8px] border border-[#E4E8FF] bg-[#FAFAFF] px-3 py-2 text-[11px] text-[#141A33] outline-none focus:border-[#818CF8]"
                >
                    {COURSES.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </section>

            {isLoading ? (
                <section className="rounded-[16px] bg-white p-8 text-center text-[12px] text-[#60657A]">
                    Cargando estudiantes...
                </section>
            ) : error ? (
                <section className="rounded-[16px] bg-white p-8 text-center text-[12px] text-[#B91C1C]">
                    {error}
                </section>
            ) : (
                <>
                    {/* Tarjetas de estadísticas */}
                    <section
                        aria-label="Resumen de estudiantes"
                        className="grid grid-cols-1 gap-3 md:grid-cols-3"
                    >
                        <div className="flex min-h-[75px] items-center gap-3 rounded-[13px] bg-white px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#E4E8FF] text-[21px] text-[#4F46E5]">
                ♙
              </span>

                            <div>
                                <p className="text-[23px] font-bold leading-none text-[#141A33]">
                                    {totalStudents}
                                </p>

                                <p className="mt-1 text-[11px] text-[#60657A]">
                                    Estudiantes matriculados
                                </p>
                            </div>
                        </div>

                        <div className="flex min-h-[75px] items-center gap-3 rounded-[13px] bg-white px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#66F2BD] text-[20px] font-bold text-[#075E43]">
                ✓
              </span>

                            <div>
                                <p className="text-[23px] font-bold leading-none text-[#141A33]">
                                    {activeStudents} de {totalStudents}
                                </p>

                                <p className="mt-1 text-[11px] text-[#60657A]">
                                    Estudiantes con actividad
                                </p>
                            </div>
                        </div>

                        <div className="flex min-h-[75px] items-center gap-3 rounded-[13px] bg-white px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#FFDCB7] text-[22px] text-[#A65C11]">
                ↗
              </span>

                            <div>
                                <p className="text-[23px] font-bold leading-none text-[#141A33]">
                                    {averageMastery === null
                                        ? '—'
                                        : `${averageMastery}%`}
                                </p>

                                <p className="mt-1 text-[11px] text-[#60657A]">
                                    Dominio promedio
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Listado */}
                    <section className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h2 className="text-[15px] font-semibold text-[#141A33]">
                                    Lista de estudiantes
                                </h2>

                                <p className="mt-1 text-[11px] text-[#60657A]">
                                    Selecciona un estudiante para consultar su
                                    progreso por subtema.
                                </p>
                            </div>

                            <span className="rounded-[6px] bg-[#E4E8FF] px-3 py-1 text-[11px] font-semibold text-[#303A65]">
                {totalStudents} estudiantes
              </span>
                        </div>

                        {students.length === 0 ? (
                            <section className="rounded-[16px] bg-white px-6 py-12 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E4E8FF] text-[22px] text-[#4F46E5]">
                                    ♙
                                </div>

                                <h3 className="mt-4 text-[16px] font-semibold text-[#141A33]">
                                    Aún no hay estudiantes matriculados
                                </h3>

                                <p className="mx-auto mt-2 max-w-lg text-[12px] text-[#60657A]">
                                    Cuando haya estudiantes registrados en este curso,
                                    aparecerán aquí junto con sus estadísticas.
                                </p>
                            </section>
                        ) : (
                            <StudentTable
                                students={students}
                                onViewProgress={(student) =>
                                    navigate(`/estudiantes/${student.id}`)
                                }
                            />
                        )}
                    </section>
                </>
            )}
        </main>
    )
}
