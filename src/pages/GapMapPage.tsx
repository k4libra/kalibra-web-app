
import { useNavigate, useParams } from 'react-router'

import { SubtopicPriorityList } from '@/components/student-monitoring'
import { COURSES, SUBTOPICS } from '@/mocks/courses.mock'
import { useCourseGapMap } from '@/hooks/useStudentMonitoring'

export function GapMapPage() {
    const navigate = useNavigate()
    const { courseId = '' } = useParams<{ courseId: string }>()

    const { gapMap, isLoading, error } = useCourseGapMap(courseId)

    const course = COURSES.find((item) => item.id === courseId)

    const courseSubtopics = SUBTOPICS.filter(
        (subtopic) => subtopic.courseId === courseId,
    )

    if (isLoading) {
        return (
            <main className="p-6">
                <p className="text-sm text-slate-500">
                    Cargando mapa de brechas...
                </p>
            </main>
        )
    }

    if (error || !gapMap || !course) {
        return (
            <main className="space-y-4 p-6">
                <h1 className="text-2xl font-semibold text-slate-900">
                    No se pudo cargar el mapa de brechas
                </h1>

                <p className="text-sm text-red-600">
                    {error ?? 'No se encontró el curso solicitado.'}
                </p>

                <button
                    type="button"
                    onClick={() => navigate('/cursos')}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                >
                    Volver a cursos
                </button>
            </main>
        )
    }

    const { stats, subtopics } = gapMap

    const weakestSubtopic = courseSubtopics.find(
        (subtopic) => subtopic.id === stats.weakestSubtopicId,
    )

    const weakestGap = subtopics.find(
        (subtopic) => subtopic.subtopicId === stats.weakestSubtopicId,
    )

    const hasEnoughData =
        stats.activeStudents > 0 &&
        stats.averageMastery !== null

    return (
        <main className="flex flex-col gap-6 p-6">
            <header>
                <button
                    type="button"
                    onClick={() => navigate('/cursos')}
                    className="mb-4 text-sm font-medium text-indigo-600 hover:underline"
                >
                    ← Volver a cursos
                </button>

                <p className="text-sm font-medium text-slate-500">
                    SEGUIMIENTO ACADÉMICO
                </p>

                <h1 className="mt-2 text-2xl font-bold text-slate-900">
                    Mapa de brechas
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    {course.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    Identifica los subtemas que requieren mayor refuerzo
                    a partir del desempeño de los estudiantes.
                </p>
            </header>

            {!hasEnoughData ? (
                <section className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <span className="text-xl" aria-hidden="true">
              📊
            </span>
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        Aún no hay datos suficientes
                    </h2>

                    <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500">
                        El mapa de brechas estará disponible cuando
                        los estudiantes comiencen a resolver ejercicios
                        y se registre información sobre su dominio
                        de los subtemas.
                    </p>
                </section>
            ) : (
                <>
                    <section
                        aria-label="Resumen del mapa de brechas"
                        className="grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <p className="text-sm text-slate-500">
                                Dominio promedio del grupo
                            </p>

                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {Math.round(stats.averageMastery!)}%
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <p className="text-sm text-slate-500">
                                Subtema más débil
                            </p>

                            <p className="mt-3 text-3xl font-bold text-red-600">
                                {weakestGap?.averageMastery === null ||
                                weakestGap?.averageMastery === undefined
                                    ? 'Sin datos'
                                    : `${Math.round(weakestGap.averageMastery)}%`}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                {weakestSubtopic?.name ?? 'No identificado'}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <p className="text-sm text-slate-500">
                                Estudiantes con actividad
                            </p>

                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {stats.activeStudents}
                                <span className="text-lg font-normal text-slate-400">
                  {' '}/ {stats.totalStudents}
                </span>
                            </p>
                        </div>
                    </section>

                    <SubtopicPriorityList
                        subtopics={courseSubtopics}
                        gaps={subtopics}
                    />

                    <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
                        <h2 className="font-semibold text-indigo-900">
                            ¿Cómo interpretar el mapa de brechas?
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-indigo-800">
                            Los porcentajes representan el dominio estimado
                            de los estudiantes en cada subtema. Los valores
                            más bajos permiten identificar contenidos que
                            podrían requerir actividades de refuerzo.
                            Los subtemas sin actividad se muestran sin datos.
                        </p>
                    </section>
                </>
            )}
        </main>
    )
}
