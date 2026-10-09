
import type { Subtopic } from '@/types/course'
import type { StudentSubtopicMastery } from '@/types/studentMonitoring'

export interface StudentMasteryTableProps {
    subtopics: Subtopic[]
    masteryRecords: StudentSubtopicMastery[]
}

function getMasteryStyle(mastery: number | null) {
    if (mastery === null) {
        return {
            label: 'Sin datos',
            badge: 'bg-[#E4E8FF] text-[#626B89]',
            bar: 'bg-[#E4E8FF]',
            icon: '⌛',
        }
    }

    if (mastery < 40) {
        return {
            label: 'Dominio bajo',
            badge: 'bg-[#FFD9D7] text-[#B91C1C]',
            bar: 'bg-[#C91E22]',
            icon: '↘',
        }
    }

    if (mastery <= 70) {
        return {
            label: 'Dominio medio',
            badge: 'bg-[#FFDCB7] text-[#805013]',
            bar: 'bg-[#F59E0B]',
            icon: '→',
        }
    }

    return {
        label: 'Dominio alto',
        badge: 'bg-[#66F2BD] text-[#075E43]',
        bar: 'bg-[#047857]',
        icon: '↗',
    }
}

export function StudentMasteryTable({
                                        subtopics,
                                        masteryRecords,
                                    }: StudentMasteryTableProps) {
    const records = new Map(
        masteryRecords.map((record) => [
            record.subtopicId,
            record,
        ]),
    )

    const orderedSubtopics = [...subtopics].sort(
        (a, b) => a.order - b.order,
    )

    return (
        <section className="rounded-[16px] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(30,35,80,0.04)]">
            <div className="border-b border-[#E7EAFE] pb-4">
                <h2 className="text-[15px] font-semibold text-[#141A33]">
                    Dominio estimado por subtema
                </h2>

                <p className="mt-1 text-[11px] text-[#60657A]">
                    Se actualiza con cada respuesta que el estudiante envía
                </p>
            </div>

            {orderedSubtopics.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#60657A]">
                    Este curso todavía no tiene subtemas registrados.
                </p>
            ) : (
                <div className="divide-y divide-[#E7EAFE]">
                    {orderedSubtopics.map((subtopic) => {
                        const record = records.get(subtopic.id)
                        const mastery = record?.mastery ?? null
                        const resolved = record?.resolvedExercises ?? 0
                        const style = getMasteryStyle(mastery)

                        return (
                            <div
                                key={subtopic.id}
                                className="grid grid-cols-1 items-center gap-3 py-[15px] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1.25fr)_40px_105px_75px]"
                            >
                                <h3 className="text-[12px] font-medium text-[#141A33]">
                                    {subtopic.name}
                                </h3>

                                <div
                                    role="progressbar"
                                    aria-label={`Dominio de ${subtopic.name}`}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={mastery ?? undefined}
                                    aria-valuetext={
                                        mastery === null
                                            ? 'Sin datos'
                                            : `${Math.round(mastery)}%`
                                    }
                                    className="h-[9px] overflow-hidden rounded-full bg-[#E4E8FF]"
                                >
                                    <div
                                        className={`h-full rounded-full ${style.bar}`}
                                        style={{
                                            width: `${Math.max(0, Math.min(100, mastery ?? 0))}%`,
                                        }}
                                    />
                                </div>

                                <span className="text-right text-[12px] font-semibold text-[#141A33]">
                  {mastery === null
                      ? '—'
                      : `${Math.round(mastery)}%`}
                </span>

                                <span
                                    className={`inline-flex w-fit items-center justify-center gap-1 whitespace-nowrap rounded-[5px] px-2 py-[4px] text-[10px] font-semibold ${style.badge}`}
                                >
                  <span>{style.icon}</span>
                                    {style.label}
                </span>

                                <span className="text-right text-[10px] text-[#60657A]">
                  {resolved > 0
                      ? `${resolved} ejercicios`
                      : 'Sin ejercicios'}
                </span>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
