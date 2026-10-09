
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { SubtopicPriorityList } from '@/components/student-monitoring'
import { COURSES, SUBTOPICS } from '@/mocks/courses.mock'
import { useCourseGapMap } from '@/hooks/useStudentMonitoring'
import { studentMonitoringService } from '@/services/studentMonitoring.service'

import type {
    MonitoredStudent,
    StudentProgress,
} from '@/types/studentMonitoring'

function getMasteryCellStyle(mastery: number | null) {
    if (mastery === null) {
        return 'bg-[#E4E8FF] text-[#626B89]'
    }

    if (mastery < 40) {
        return 'bg-[#FFD9D7] text-[#B91C1C]'
    }

    if (mastery <= 70) {
        return 'bg-[#FFDCB7] text-[#805013]'
    }

    return 'bg-[#66F2BD] text-[#075E43]'
}

export function GapMapPage() {
    const navigate = useNavigate()
    const { courseId = '' } = useParams<{ courseId: string }>()

    const { gapMap, isLoading, error } = useCourseGapMap(courseId)

    const [students, setStudents] = useState<MonitoredStudent[]>([])
    const [progressByStudent, setProgressByStudent] = useState<
        Record<string, StudentProgress>
    >({})

    useEffect(() => {
        let cancelled = false

        async function loadStudents() {
            setStudents([])
            setProgressByStudent({})

            try {
                const courseStudents =
                    await studentMonitoringService.getStudentsByCourse(courseId)

                const progressList = await Promise.all(
                    courseStudents.map((student) =>
                        studentMonitoringService.getStudentProgress(student.id),
                    ),
                )

                if (cancelled) return

                setStudents(courseStudents)
                setProgressByStudent(
                    Object.fromEntries(
                        progressList.map((progress) => [
                            progress.student.id,
                            progress,
                        ]),
                    ),
                )
            } catch (loadError) {
                console.error('Error al cargar estudiantes:', loadError)
            }
        }

        if (courseId) {
            void loadStudents()
        }

        return () => {
            cancelled = true
        }
    }, [courseId])

    const course = COURSES.find((item) => item.id === courseId)

    const courseSubtopics = SUBTOPICS.filter(
        (subtopic) => subtopic.courseId === courseId,
    ).sort((a, b) => a.order - b.order)

    if (isLoading) {
        return (
            <main className="p-6 text-sm text-[#60657A]">
                Cargando mapa de brechas...
            </main>
        )
    }

    if (error || !gapMap || !course) {
        return (
            <main className="space-y-4 p-6">
                <h1 className="text-xl font-semibold text-[#141A33]">
                    No se pudo cargar el mapa de brechas
                </h1>

                <p className="text-sm text-red-600">
                    {error ?? 'Curso no encontrado.'}
                </p>

                <button
                    type="button"
                    onClick={() => navigate('/cursos')}
                    className="text-sm font-medium text-indigo-600"
                >
                    ← Volver a cursos
                </button>
            </main>
        )
    }

    const { stats, subtopics } = gapMap

    const weakestSubtopic = courseSubtopics.find(
        (item) => item.id === stats.weakestSubtopicId,
    )

    const weakestGap = subtopics.find(
        (item) => item.subtopicId === stats.weakestSubtopicId,
    )

    const hasEnoughData =
        stats.activeStudents > 0 &&
        stats.averageMastery !== null

    return (
        <main className="flex flex-col gap-5 p-6">
            {/* Encabezado */}
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.02em] text-[#60657A]">
                        Mis cursos › {course.name}
                    </p>

                    <h1 className="mt-1 text-[22px] font-bold leading-tight text-[#141A33]">
                        Mapa de brechas
                    </h1>

                    <p className="mt-1 text-[11px] text-[#60657A]">
                        Qué tan bien domina tu grupo cada subtema, para
                        priorizar qué reforzar en clase y a quién apoyar.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/estudiantes')}
                    className="inline-flex items-center gap-2 rounded-[9px] bg-[#E4E8FF] px-4 py-[10px] text-[11px] font-semibold text-[#303A65] hover:bg-[#D5DCFF]"
                >
          <span aria-hidden="true" className="text-[15px]">
            ♧
          </span>
                    Ver estudiantes
                </button>
            </header>

            {!hasEnoughData ? (
                /* Estado sin datos */
                <section className="rounded-[16px] bg-white px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E4E8FF] text-[#4F46E5]">
            <span aria-hidden="true" className="text-[24px]">
              ▤
            </span>
                    </div>

                    <h2 className="mt-4 text-[16px] font-semibold text-[#141A33]">
                        Aún no hay datos suficientes
                    </h2>

                    <p className="mx-auto mt-2 max-w-lg text-[12px] leading-relaxed text-[#60657A]">
                        Cuando tus estudiantes comiencen a resolver ejercicios,
                        podrás identificar qué subtemas necesitan refuerzo.
                    </p>

                    <div className="mx-auto mt-6 max-w-lg rounded-[9px] bg-[#E4E8FF] p-4 text-left text-[11px] text-[#303A65]">
                        El mapa se actualizará conforme los estudiantes
                        registren actividad en el curso.
                    </div>
                </section>
            ) : (
                <>
                    {/* Estadísticas */}
                    <section
                        aria-label="Resumen del mapa de brechas"
                        className="grid grid-cols-1 gap-3 md:grid-cols-3"
                    >
                        <div className="flex min-h-[75px] items-center gap-3 rounded-[13px] bg-white px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#E4E8FF] text-[#4F46E5]">
                <span aria-hidden="true" className="text-[22px]">
                  ↗
                </span>
              </span>

                            <div>
                                <p className="text-[23px] font-bold leading-none text-[#141A33]">
                                    {Math.round(stats.averageMastery!)}%
                                </p>

                                <p className="mt-1 text-[11px] text-[#60657A]">
                                    Dominio promedio del grupo
                                </p>
                            </div>
                        </div>

                        <div className="flex min-h-[75px] items-center gap-3 rounded-[13px] bg-white px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#FFD9D7] text-[#C91E22]">
                <span aria-hidden="true" className="text-[22px]">
                  ↘
                </span>
              </span>

                            <div>
                                <p className="text-[23px] font-bold leading-none text-[#141A33]">
                                    {weakestGap?.averageMastery == null
                                        ? '—'
                                        : `${Math.round(weakestGap.averageMastery)}%`}
                                </p>

                                <p className="mt-1 text-[11px] text-[#60657A]">
                                    Subtema más débil
                                </p>
                            </div>
                        </div>

                        <div className="flex min-h-[75px] items-center gap-3 rounded-[13px] bg-white px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#66F2BD] text-[#075E43]">
                <span aria-hidden="true" className="text-[22px]">
                  ♧
                </span>
              </span>

                            <div>
                                <p className="text-[23px] font-bold leading-none text-[#141A33]">
                                    {stats.activeStudents} de {stats.totalStudents}
                                </p>

                                <p className="mt-1 text-[11px] text-[#60657A]">
                                    Estudiantes con actividad
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Prioridades */}
                    <SubtopicPriorityList
                        subtopics={courseSubtopics}
                        gaps={subtopics}
                    />

                    {/* Matriz de dominio */}
                    <section className="rounded-[16px] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(30,35,80,0.04)]">
                        <div className="border-b border-[#E7EAFE] pb-4">
                            <h2 className="text-[15px] font-semibold text-[#141A33]">
                                Dominio por estudiante y subtema
                            </h2>

                            <p className="mt-1 text-[11px] text-[#60657A]">
                                Identifica quién necesita apoyo en cada subtema.
                                Selecciona a un estudiante para ver su progreso.
                            </p>
                        </div>

                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[720px] border-separate border-spacing-[6px]">
                                <thead>
                                <tr>
                                    <th className="w-48 px-2 pb-2 text-left text-[10px] font-semibold uppercase text-[#60657A]">
                                        Estudiante
                                    </th>

                                    {courseSubtopics.map((subtopic) => (
                                        <th
                                            key={subtopic.id}
                                            className="px-2 pb-2 text-center text-[10px] font-medium text-[#60657A]"
                                        >
                                            {subtopic.name}
                                        </th>
                                    ))}
                                </tr>
                                </thead>

                                <tbody>
                                {students.map((student) => {
                                    const progress = progressByStudent[student.id]

                                    const masteryBySubtopic = new Map(
                                        progress?.subtopics.map((item) => [
                                            item.subtopicId,
                                            item.mastery,
                                        ]) ?? [],
                                    )

                                    return (
                                        <tr key={student.id}>
                                            <td className="px-1 py-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(`/estudiantes/${student.id}`)
                                                    }
                                                    className="flex w-full items-center gap-2 text-left hover:text-[#4F46E5]"
                                                >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E4E8FF] text-[10px] font-semibold text-[#4F46E5]">
                              {student.initials}
                            </span>

                                                    <span className="flex-1 text-[11px] font-medium text-[#141A33]">
                              {student.fullName}
                            </span>

                                                    <span className="text-[#60657A]">›</span>
                                                </button>
                                            </td>

                                            {courseSubtopics.map((subtopic) => {
                                                const mastery =
                                                    masteryBySubtopic.get(subtopic.id) ?? null

                                                return (
                                                    <td key={subtopic.id}>
                                                        <div
                                                            className={`rounded-[7px] px-3 py-[13px] text-center text-[12px] font-semibold ${getMasteryCellStyle(mastery)}`}
                                                        >
                                                            {mastery === null
                                                                ? '—'
                                                                : `${Math.round(mastery)}%`}
                                                        </div>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Recomendación */}
                    {weakestSubtopic && (
                        <section className="flex items-center gap-3 rounded-[9px] bg-[#FFDCB7] px-4 py-3 text-[11px] text-[#56330D]">
              <span
                  aria-hidden="true"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#805013] text-[12px] font-bold"
              >
                !
              </span>

                            <p>
                                Prioriza{' '}
                                <strong>{weakestSubtopic.name}</strong> en tu
                                próxima clase: {weakestGap?.lowMasteryCount ?? 0}{' '}
                                estudiantes tienen dominio bajo en este subtema.
                            </p>
                        </section>
                    )}
                </>
            )}
        </main>
    )
}
