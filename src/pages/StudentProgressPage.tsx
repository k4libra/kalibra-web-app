
import { useNavigate, useParams } from 'react-router'

import { StudentMasteryTable } from '@/components/student-monitoring'
import { SUBTOPICS } from '@/mocks/courses.mock'
import { useStudentProgress } from '@/hooks/useStudentMonitoring'

export function StudentProgressPage() {
    const navigate = useNavigate()
    const { studentId = '' } = useParams<{ studentId: string }>()

    const {
        progress,
        isLoading,
        error,
    } = useStudentProgress(studentId)

    if (isLoading) {
        return (
            <main className="p-6">
                <p className="text-sm text-slate-500">
                    Cargando progreso del estudiante...
                </p>
            </main>
        )
    }

    if (error || !progress) {
        return (
            <main className="space-y-4 p-6">
                <h1 className="text-2xl font-semibold">
                    No se pudo cargar el progreso
                </h1>

                <p className="text-sm text-red-600">
                    {error ?? 'Estudiante no encontrado.'}
                </p>

                <button
                    type="button"
                    onClick={() => navigate('/estudiantes')}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                >
                    Volver a estudiantes
                </button>
            </main>
        )
    }

    const { student, subtopics } = progress

    const courseSubtopics = SUBTOPICS.filter(
        (subtopic) => subtopic.courseId === student.courseId,
    )

    const hasActivity = student.resolvedExercises > 0

    const weakestSubtopic = subtopics
        .filter(
            (subtopic) =>
                subtopic.mastery !== null &&
                subtopic.resolvedExercises > 0,
        )
        .sort((a, b) => (a.mastery ?? 0) - (b.mastery ?? 0))[0]

    const weakestSubtopicName = courseSubtopics.find(
        (subtopic) => subtopic.id === weakestSubtopic?.subtopicId,
    )?.name

    return (
        <main className="flex flex-col gap-6 p-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate('/estudiantes')}
                    className="mb-4 text-sm font-medium text-indigo-600 hover:underline"
                >
                    ← Volver a estudiantes
                </button>

                <p className="text-sm font-medium text-slate-500">
                    SEGUIMIENTO DE ESTUDIANTES
                </p>

                <h1 className="mt-2 text-2xl font-bold text-slate-900">
                    {student.fullName}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    {student.email}
                </p>
            </div>

            {hasActivity ? (
                <>
                    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <p className="text-sm text-slate-500">
                                Dominio promedio
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {student.averageMastery === null
                                    ? 'Sin datos'
                                    : `${student.averageMastery}%`}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <p className="text-sm text-slate-500">
                                Ejercicios resueltos
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {student.resolvedExercises}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <p className="text-sm text-slate-500">
                                Respuestas correctas
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {student.correctAnswers} de {student.resolvedExercises}
                            </p>
                        </div>
                    </section>

                    <StudentMasteryTable
                        subtopics={courseSubtopics}
                        masteryRecords={subtopics}
                    />

                    {weakestSubtopicName && (
                        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                            <h2 className="font-semibold text-amber-900">
                                Recomendación de refuerzo
                            </h2>

                            <p className="mt-2 text-sm text-amber-800">
                                Se recomienda reforzar el subtema{' '}
                                <strong>{weakestSubtopicName}</strong>,
                                ya que presenta el menor dominio estimado
                                del estudiante.
                            </p>
                        </section>
                    )}
                </>
            ) : (
                <section className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Aún no hay actividad registrada
                    </h2>

                    <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500">
                        Este estudiante todavía no ha resuelto ejercicios.
                        Cuando comience a practicar, podrás consultar
                        su dominio estimado y sus resultados por subtema.
                    </p>
                </section>
            )}
        </main>
    )
}
