
/**
 * Individual student mastery table.
 *
 * @remarks
 * Displays estimated mastery, resolved exercises
 * and correct answers for each course subtopic.
 *
 * Reuses ProgressBar from the develop design system.
 *
 * @packageDocumentation
 */

import { ProgressBar } from '@/components/ui'

import type { Subtopic } from '@/types/course'
import type { StudentSubtopicMastery } from '@/types/studentMonitoring'

import { MasteryBadge, getMasteryLevel } from './MasteryBadge'

/**
 * Props accepted by StudentMasteryTable.
 */
export interface StudentMasteryTableProps {
    subtopics: Subtopic[]
    masteryRecords: StudentSubtopicMastery[]
}

/**
 * Returns the progress bar tone based on mastery.
 */
function getProgressTone(
    mastery: number | null,
): 'success' | 'warning' | 'danger' | 'neutral' {
    const level = getMasteryLevel(mastery)

    switch (level) {
        case 'high':
            return 'success'
        case 'medium':
            return 'warning'
        case 'low':
            return 'danger'
        default:
            return 'neutral'
    }
}

/**
 * Displays the student's progress for every subtopic.
 */
export function StudentMasteryTable({
                                        subtopics,
                                        masteryRecords,
                                    }: StudentMasteryTableProps) {
    const recordsBySubtopic = new Map(
        masteryRecords.map((record) => [
            record.subtopicId,
            record,
        ]),
    )

    const orderedSubtopics = [...subtopics].sort(
        (a, b) => a.order - b.order,
    )

    return (
        <section
            aria-label="Dominio por subtema"
            className="overflow-hidden rounded-xl border border-line-default bg-surface-background"
        >
            <div className="border-b border-line-default px-5 py-4">
                <h2 className="text-lg font-semibold text-content-primary">
                    Dominio por subtema
                </h2>

                <p className="mt-1 text-sm text-content-secondary">
                    Desempeño estimado a partir de los ejercicios resueltos.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-surface-secondary">
                    <tr className="text-xs font-semibold uppercase tracking-wide text-content-secondary">
                        <th scope="col" className="px-5 py-4">
                            Subtema
                        </th>

                        <th scope="col" className="px-5 py-4">
                            Dominio estimado
                        </th>

                        <th scope="col" className="px-5 py-4 text-center">
                            Ejercicios resueltos
                        </th>

                        <th scope="col" className="px-5 py-4 text-center">
                            Respuestas correctas
                        </th>

                        <th scope="col" className="px-5 py-4">
                            Nivel
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-line-default">
                    {orderedSubtopics.map((subtopic) => {
                        const record = recordsBySubtopic.get(subtopic.id)

                        const mastery = record?.mastery ?? null
                        const resolvedExercises =
                            record?.resolvedExercises ?? 0
                        const correctAnswers =
                            record?.correctAnswers ?? 0

                        return (
                            <tr
                                key={subtopic.id}
                                className="hover:bg-surface-secondary"
                            >
                                {/* Subtopic */}
                                <td className="px-5 py-4">
                                    <p className="font-medium text-content-primary">
                                        {subtopic.name}
                                    </p>
                                </td>

                                {/* Estimated mastery */}
                                <td className="px-5 py-4">
                                    <div className="flex min-w-[150px] flex-col gap-2">
                      <span className="text-sm font-semibold text-content-primary">
                        {mastery === null
                            ? 'Sin datos'
                            : `${Math.round(mastery)}%`}
                      </span>

                                        <ProgressBar
                                            value={mastery}
                                            label={`Dominio de ${subtopic.name}`}
                                            tone={getProgressTone(mastery)}
                                            size="sm"
                                        />
                                    </div>
                                </td>

                                {/* Resolved exercises */}
                                <td className="px-5 py-4 text-center text-sm text-content-primary">
                                    {resolvedExercises}
                                </td>

                                {/* Correct answers */}
                                <td className="px-5 py-4 text-center text-sm text-content-primary">
                                    {correctAnswers}
                                </td>

                                {/* Mastery level */}
                                <td className="px-5 py-4">
                                    <MasteryBadge mastery={mastery} />
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>

            {orderedSubtopics.length === 0 && (
                <div className="px-5 py-10 text-center text-sm text-content-secondary">
                    Este curso todavía no tiene subtemas registrados.
                </div>
            )}
        </section>
    )
}
