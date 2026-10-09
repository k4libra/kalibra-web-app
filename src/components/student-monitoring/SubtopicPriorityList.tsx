
import type { Subtopic } from '@/types/course'
import type { SubtopicGap } from '@/types/studentMonitoring'

export interface SubtopicPriorityListProps {
    subtopics: Subtopic[]
    gaps: SubtopicGap[]
}

function getPriority(mastery: number | null) {
    if (mastery === null) {
        return {
            label: 'Sin práctica aún',
            badge: 'bg-[#E4E8FF] text-[#50566F]',
            icon: '⌛',
        }
    }

    if (mastery < 40) {
        return {
            label: 'Reforzar en clase',
            badge: 'bg-[#FFD9D7] text-[#9B1515]',
            icon: '!',
        }
    }

    if (mastery <= 70) {
        return {
            label: 'En progreso',
            badge: 'bg-[#FFDCB7] text-[#805013]',
            icon: '→',
        }
    }

    return {
        label: 'Buen avance',
        badge: 'bg-[#66F2BD] text-[#075E43]',
        icon: '↗',
    }
}

function getDistribution(gap: SubtopicGap) {
    const parts: string[] = []

    if (gap.lowMasteryCount) {
        parts.push(`${gap.lowMasteryCount} en bajo`)
    }

    if (gap.mediumMasteryCount) {
        parts.push(`${gap.mediumMasteryCount} en medio`)
    }

    if (gap.highMasteryCount) {
        parts.push(`${gap.highMasteryCount} en alto`)
    }

    if (gap.noDataCount) {
        parts.push(`${gap.noDataCount} sin datos`)
    }

    return parts.join(' · ')
}

export function SubtopicPriorityList({
                                         subtopics,
                                         gaps,
                                     }: SubtopicPriorityListProps) {
    const names = new Map(
        subtopics.map((subtopic) => [subtopic.id, subtopic.name]),
    )

    const sortedGaps = [...gaps].sort((a, b) => {
        if (a.averageMastery === null) return 1
        if (b.averageMastery === null) return -1
        return a.averageMastery - b.averageMastery
    })

    return (
        <section className="rounded-[16px] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(30,35,80,0.04)]">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4 border-b border-[#E7EAFE] pb-4">
                <div>
                    <h2 className="text-[15px] font-semibold text-[#141A33]">
                        Prioridad de refuerzo por subtema
                    </h2>

                    <p className="mt-1 text-[11px] text-[#5F647A]">
                        Cuántos de tus estudiantes están en cada nivel
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[10px] text-[#5F647A]">
                    {[
                        ['#C91E22', 'Bajo <40%'],
                        ['#F59E0B', 'Medio 40–70%'],
                        ['#047857', 'Alto >70%'],
                        ['#E4E8FF', 'Sin datos'],
                    ].map(([color, label]) => (
                        <span key={label} className="flex items-center gap-1.5">
              <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
              />
                            {label}
            </span>
                    ))}
                </div>
            </div>

            <div className="divide-y divide-[#E7EAFE]">
                {sortedGaps.map((gap) => {
                    const priority = getPriority(gap.averageMastery)

                    const total =
                        gap.lowMasteryCount +
                        gap.mediumMasteryCount +
                        gap.highMasteryCount +
                        gap.noDataCount

                    const segments = [
                        { count: gap.lowMasteryCount, color: '#C91E22' },
                        { count: gap.mediumMasteryCount, color: '#F59E0B' },
                        { count: gap.highMasteryCount, color: '#047857' },
                        { count: gap.noDataCount, color: '#E4E8FF' },
                    ]

                    return (
                        <div
                            key={gap.subtopicId}
                            className="grid gap-3 py-[15px] md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.5fr)_78px] md:items-center"
                        >
                            <div>
                                <h3 className="text-[13px] font-semibold text-[#141A33]">
                                    {names.get(gap.subtopicId) ?? 'Subtema'}
                                </h3>

                                <span
                                    className={`mt-1 inline-flex items-center gap-1 rounded-[5px] px-2 py-[3px] text-[10px] font-semibold ${priority.badge}`}
                                >
                  <span>{priority.icon}</span>
                                    {priority.label}
                </span>
                            </div>

                            <div>
                                <div className="flex h-[11px] w-full gap-[3px] overflow-hidden rounded-[4px]">
                                    {total > 0 &&
                                        segments
                                            .filter((segment) => segment.count > 0)
                                            .map((segment, index) => (
                                                <div
                                                    key={index}
                                                    className="h-full rounded-[3px]"
                                                    style={{
                                                        width: `${(segment.count / total) * 100}%`,
                                                        backgroundColor: segment.color,
                                                    }}
                                                />
                                            ))}
                                </div>

                                <p className="mt-[7px] text-[10px] text-[#60657A]">
                                    {gap.studentsWithActivity === 0
                                        ? `${gap.noDataCount} sin datos · nadie ha practicado este subtema`
                                        : getDistribution(gap)}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-[17px] font-semibold text-[#141A33]">
                                    {gap.averageMastery === null
                                        ? '—'
                                        : `${Math.round(gap.averageMastery)}%`}
                                </p>

                                <p className="text-[10px] text-[#60657A]">
                                    promedio
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
