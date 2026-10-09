
import type { MonitoredStudent } from '@/types/studentMonitoring'

export interface StudentTableProps {
    students: MonitoredStudent[]
    onViewProgress: (student: MonitoredStudent) => void
}

function formatLastActivity(value: string | null): string {
    if (!value) return 'Sin actividad'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return 'Sin actividad'
    }

    return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date)
}

function getMasteryStyle(mastery: number | null) {
    if (mastery === null) {
        return {
            label: 'Sin datos',
            className: 'bg-[#E4E8FF] text-[#626B89]',
        }
    }

    if (mastery < 40) {
        return {
            label: 'Dominio bajo',
            className: 'bg-[#FFD9D7] text-[#B91C1C]',
        }
    }

    if (mastery <= 70) {
        return {
            label: 'Dominio medio',
            className: 'bg-[#FFDCB7] text-[#805013]',
        }
    }

    return {
        label: 'Dominio alto',
        className: 'bg-[#66F2BD] text-[#075E43]',
    }
}

export function StudentTable({
                                 students,
                                 onViewProgress,
                             }: StudentTableProps) {
    return (
        <section className="overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(30,35,80,0.04)]">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                    <thead>
                    <tr className="border-b border-[#E7EAFE] bg-[#FAFAFF]">
                        <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#60657A]">
                            Estudiante
                        </th>

                        <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#60657A]">
                            Resueltos
                        </th>

                        <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#60657A]">
                            Dominio promedio
                        </th>

                        <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#60657A]">
                            Última actividad
                        </th>

                        <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.04em] text-[#60657A]">
                            Acción
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-[#E7EAFE]">
                    {students.map((student) => {
                        const mastery = getMasteryStyle(
                            student.averageMastery,
                        )

                        return (
                            <tr
                                key={student.id}
                                className="transition-colors hover:bg-[#FAFAFF]"
                            >
                                {/* Estudiante */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E4E8FF] text-[11px] font-bold text-[#4F46E5]">
                        {student.initials}
                      </span>

                                        <div className="min-w-0">
                                            <p className="truncate text-[12px] font-semibold text-[#141A33]">
                                                {student.fullName}
                                            </p>

                                            <p className="mt-0.5 truncate text-[10px] text-[#60657A]">
                                                {student.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Ejercicios resueltos */}
                                <td className="px-4 py-4 text-[12px] font-medium text-[#141A33]">
                                    {student.resolvedExercises}
                                </td>

                                {/* Dominio promedio */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        {student.averageMastery !== null && (
                                            <span className="text-[12px] font-semibold text-[#141A33]">
                          {Math.round(student.averageMastery)}%
                        </span>
                                        )}

                                        <span
                                            className={`inline-flex items-center whitespace-nowrap rounded-[5px] px-2 py-[4px] text-[10px] font-semibold ${mastery.className}`}
                                        >
                        {mastery.label}
                      </span>
                                    </div>
                                </td>

                                {/* Última actividad */}
                                <td className="px-4 py-4 text-[11px] text-[#60657A]">
                                    {student.lastActivityAt === null ? (
                                        <span className="inline-flex rounded-[5px] bg-[#F0F1F8] px-2 py-1 text-[10px] text-[#626B89]">
                        Sin actividad
                      </span>
                                    ) : (
                                        formatLastActivity(student.lastActivityAt)
                                    )}
                                </td>

                                {/* Acción */}
                                <td className="px-5 py-4 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onViewProgress(student)}
                                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-[8px] bg-[#E4E8FF] px-3 py-2 text-[11px] font-semibold text-[#303A65] transition-colors hover:bg-[#D5DCFF]"
                                    >
                                        Ver progreso
                                        <span aria-hidden="true">→</span>
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>

            {students.length === 0 && (
                <div className="px-5 py-10 text-center text-[12px] text-[#60657A]">
                    No hay estudiantes matriculados en este curso.
                </div>
            )}
        </section>
    )
}
