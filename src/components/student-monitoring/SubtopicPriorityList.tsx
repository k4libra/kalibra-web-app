
/**
 * Subtopic reinforcement priority list.
 *
 * @remarks
 * Displays course subtopics ordered by their estimated
 * group mastery, prioritizing the lowest scores.
 *
 * Reuses the ProgressBar component from develop.
 *
 * @packageDocumentation
 */

import { ProgressBar } from '@/components/ui'

import type { Subtopic } from '@/types/course'
import type { SubtopicGap } from '@/types/studentMonitoring'

import { MasteryBadge, getMasteryLevel } from './MasteryBadge'

/**
 * Props accepted by SubtopicPriorityList.
 */
export interface SubtopicPriorityListProps {
    subtopics: Subtopic[]
    gaps: SubtopicGap[]
}

/**
 * Returns the progress bar color for a mastery value.
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
 * Renders subtopics requiring reinforcement.
 */
export function SubtopicPriorityList({
                                         subtopics,
                                         gaps,
                                     }: SubtopicPriorityListProps) {
    const sortedGaps = [...gaps].sort((a, b) => {
        if (a.averageMastery === null) return 1
        if (b.averageMastery === null) return -1

        return a.averageMastery - b.averageMastery
    })

    const subtopicNames = new Map(
        subtopics.map((subtopic) => [
            subtopic.id,
            subtopic.name,
        ]),
    )

    if (sortedGaps.length === 0) {
        return (
            <div className="rounded-xl border border-line-default bg-surface-background p-6">
                <p className="text-body-m text-content-secondary">
                    No hay subtemas disponibles para analizar.
                </p>
            </div>
        )
    }

    return (
        <section
            aria-label="Prioridades de refuerzo"
            className="rounded-xl border border-line-default bg-surface-background p-5"
        >
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-content-primary">
                    Prioridades de refuerzo
                </h2>

                <p className="mt-1 text-sm text-content-secondary">
                    Subtemas ordenados de menor a mayor dominio promedio.
                </p>
            </div>

            <div className="space-y-5">
                {sortedGaps.map((gap, index) => {
                    const name =
                        subtopicNames.get(gap.subtopicId) ??
                        'Subtema no encontrado'

                    const hasData = gap.averageMastery !== null

                    return (
                        <div
                            key={gap.subtopicId}
                            className="rounded-lg border border-line-default p-4"
                        >
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-sm font-semibold text-content-secondary">
                    {index + 1}
                  </span>

                                    <div className="min-w-0">
                                        <h3 className="font-medium text-content-primary">
                                            {name}
                                        </h3>

                                        <p className="text-xs text-content-secondary">
                                            {gap.studentsWithActivity} estudiantes con actividad
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                  <span className="font-semibold text-content-primary">
                    {hasData
                        ? `${Math.round(gap.averageMastery!)}%`
                        : '—'}
                  </span>

                                    <MasteryBadge mastery={gap.averageMastery} />
                                </div>
                            </div>

                            <ProgressBar
                                value={gap.averageMastery}
                                label={`Dominio promedio de ${name}`}
                                tone={getProgressTone(gap.averageMastery)}
                                size="md"
                            />

                            {!hasData && (
                                <p className="mt-3 text-xs text-content-secondary">
                                    Sin datos suficientes para calcular el dominio.
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
