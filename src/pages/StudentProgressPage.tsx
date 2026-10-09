
import { useNavigate, useParams } from 'react-router'

import { StudentMasteryTable } from '@/components/student-monitoring'
import { COURSES, SUBTOPICS } from '@/mocks/courses.mock'
import { useStudentProgress } from '@/hooks/useStudentMonitoring'

function formatEnrollmentDate(value: string) {
    const date = new Date(`${value}T12:00:00Z`)

    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(date)
}

export function StudentProgressPage() {
    const navigate = useNavigate()
    const { studentId = '' } = useParams<{ studentId: string }>()

    const { progress, isLoading, error } = useStudentProgress(studentId)

    if (isLoading) {
        return (
            <main className="p-6 text-sm text-[#60657A]">
                Cargando progreso del estudiante...
            </main>
        )
    }

    if (error || !progress) {
        return (
            <main className="space-y-4 p-6">
                <h1 className="text-xl font-semibold text-[#141A33]">
                    No se pudo cargar el progreso
                </h1>

                <p className="text-sm text-red-600">
                    {error ?? 'Estudiante no encontrado.'}
                </p>

                <button
                    type="button"
                    onClick={() => navigate('/estudiantes')}
                    className="text-sm font-medium text-indigo-600"
                >
                    Volver a estudiantes
                </button>
            </main>
        )
    }

    const { student, subtopics } = progress

    const course = COURSES.find(
        (item) => item.id === student.courseId,
    )

    const courseSubtopics = SUBTOPICS.filter(
        (item) => item.courseId === student.courseId,
    )

    const hasActivity = student.resolvedExercises > 0

    const weakestSubtopic = [...subtopics]
        .filter(
            (item) =>
                item.mastery !== null &&
                item.resolvedExercises > 0,
        )
        .sort(
            (a, b) =>
                (a.mastery ?? 0) - (b.mastery ?? 0),
        )[0]

    const weakestSubtopicName = courseSubtopics.find(
        (item) => item.id === weakestSubtopic?.subtopicId,
    )?.name

    return (
        <main className="flex flex-col gap-5 p-6">
            {/* Encabezado */}
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.02em] text-[#60657A]">
                        Estudiantes · {course?.name ?? 'Curso'}
                    </p>

                    <h1 className="mt-1 text-[22px] font-bold leading-tight text-[#141A33]">
                        {student.fullName}
                    </h1>

                    <p className="mt-1 text-[11px] text-[#60657A]">
                        {student.email} · Matriculado el{' '}
                        {formatEnrollmentDate(student.enrolledAt)}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/estudiantes')}
                    className="inline-flex items-center gap-2 rounded-[9px] bg-[#E4E8FF] px-4 py-[10px] text-[11px] font-semibold text-[#303A65] transition-colors hover:bg-[#D5DCFF]"
                >
          <span aria-hidden="true" className="text-[15px]">
            ←
          </span>
                    Volver a estudiantes
                </button>
            </header>

            {hasActivity ? (
                <>
                    {/* Estadísticas */}
                    <section
                        aria-label="Resumen del progreso"
                        className="grid grid-cols-1 gap-3 md:grid-cols-3"
                    >
                        {/* Dominio promedio */}
                        <div className="flex min-h-[75px] items-center gap-3 rounded-[13px] bg-white px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#E4E8FF] text-[#4F46E5]">
                <span aria-hidden="true" className="text-[22px]">
                  ↗
                </span>
              </span>

                            <div>
                                <p className="text-[23px] font-bold leading-none text-[#141A33]">
                                    {student.averageMastery === null
                                        ? '—'
                                        : `${Math.round(student.averageMastery)}%`}
                                </p>

                                <p className="mt-1 text-[11px] text-[#60657A]">
                                    Dominio promedio
                                </p>
                            </div>
                        </div>

                        {/* Ejercicios resueltos */}
                        <div className="flex min-h-[75px] items-center gap-3 rounded-[13px] bg-white px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#FFDCB7] text-[#A65C11]">
                <span aria-hidden="true" className="text-[21px]">
                  ▣
                </span>
              </span>

                            <div>
                                <p className="text-[23px] font-bold leading-none text-[#141A33]">
                                    {student.resolvedExercises}
                                </p>

                                <p className="mt-1 text-[11px] text-[#60657A]">
                                    Ejercicios resueltos
                                </p>
                            </div>
                        </div>

                        {/* Respuestas correctas */}
                        <div className="flex min-h-[75px] items-center gap-3 rounded-[13px] bg-white px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#66F2BD] text-[#075E43]">
                <span
                    aria-hidden="true"
                    className="text-[22px] font-bold"
                >
                  ✓
                </span>
              </span>

                            <div>
                                <p className="text-[23px] font-bold leading-none text-[#141A33]">
                                    {student.correctAnswers} de {student.resolvedExercises}
                                </p>

                                <p className="mt-1 text-[11px] text-[#60657A]">
                                    Respuestas correctas
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Dominio por subtema */}
                    <StudentMasteryTable
                        subtopics={courseSubtopics}
                        masteryRecords={subtopics}
                    />

                    {/* Recomendación */}
                    {weakestSubtopic && weakestSubtopicName && (
                        <section className="flex items-center gap-3 rounded-[9px] bg-[#FFDCB7] px-4 py-3 text-[11px] text-[#56330D]">
              <span
                  aria-hidden="true"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#805013] text-[12px] font-bold"
              >
                !
              </span>

                            <p>
                                Refuerzo sugerido:{' '}
                                <strong>
                                    {weakestSubtopicName} (
                                    {Math.round(weakestSubtopic.mastery!)}%)
                                </strong>
                                . Se recomienda reforzar este subtema por su
                                bajo dominio estimado.
                            </p>
                        </section>
                    )}
                </>
            ) : (
                /* Estado sin actividad */
                <section className="rounded-[16px] bg-white px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E4E8FF] text-[#4F46E5]">
            <span aria-hidden="true" className="text-[24px]">
              ▣
            </span>
                    </div>

                    <h2 className="mt-4 text-[16px] font-semibold text-[#141A33]">
                        Aún no hay actividad registrada
                    </h2>

                    <p className="mx-auto mt-2 max-w-lg text-[12px] leading-relaxed text-[#60657A]">
                        Este estudiante todavía no ha resuelto ejercicios.
                        Cuando comience a practicar, podrás consultar
                        su dominio estimado por subtema.
                    </p>
                </section>
            )}
        </main>
    )
}
