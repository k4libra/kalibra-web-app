
/**
 * Table of students enrolled in a course.
 *
 * @remarks
 * Displays student identity, resolved exercises,
 * estimated mastery, last activity and navigation
 * to individual progress.
 *
 * @packageDocumentation
 */

import {
    Avatar,
    Button,
    TableCard,
    TableHeader,
    TableRow,
} from '@/components/ui'

import { MasteryBadge } from './MasteryBadge'

import type {
    MonitoredStudent,
} from '@/types/studentMonitoring'

/**
 * Props accepted by StudentTable.
 */
export interface StudentTableProps {
    students: MonitoredStudent[]
    onViewProgress: (student: MonitoredStudent) => void
}

/**
 * Formats a student's last recorded activity.
 */
function formatLastActivity(value: string | null): string {
    if (!value) {
        return 'Sin actividad'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return 'Sin actividad'
    }

    return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(date)
}

/**
 * Renders a responsive student monitoring table.
 */
export function StudentTable({
                                 students,
                                 onViewProgress,
                             }: StudentTableProps) {
    return (
        <TableCard label="Estudiantes del curso">
            <TableHeader
                columns={[
                    'Estudiante',
                    'Ejercicios resueltos',
                    'Dominio promedio',
                    'Última actividad',
                    'Acción',
                ]}
                className="md:grid-cols-12"
                cellClassNames={[
                    'md:col-span-4',
                    'md:col-span-2',
                    'md:col-span-2',
                    'md:col-span-2',
                    'md:col-span-2',
                ]}
            />

            {students.map((student) => (
                <TableRow
                    key={student.id}
                    className="md:grid-cols-12"
                >
                    {/* Student identity */}
                    <div
                        role="cell"
                        className="flex min-w-0 items-center gap-3 md:col-span-4"
                    >
                        <Avatar
                            initials={student.initials}
                            size="sm"
                        />

                        <div className="min-w-0">
                            <p className="truncate text-body-m-bold text-content-primary">
                                {student.fullName}
                            </p>

                            <p className="truncate text-body-m text-content-secondary">
                                {student.email}
                            </p>
                        </div>
                    </div>

                    {/* Resolved exercises */}
                    <div
                        role="cell"
                        className="text-body-m text-content-primary md:col-span-2"
                    >
            <span className="md:hidden text-content-secondary">
              Ejercicios resueltos:{' '}
            </span>
                        {student.resolvedExercises}
                    </div>

                    {/* Average mastery */}
                    <div
                        role="cell"
                        className="flex items-center gap-2 md:col-span-2"
                    >
                        {student.averageMastery !== null && (
                            <span className="text-body-m-bold text-content-primary">
                {Math.round(student.averageMastery)}%
              </span>
                        )}

                        <MasteryBadge mastery={student.averageMastery} />
                    </div>

                    {/* Last activity */}
                    <div
                        role="cell"
                        className="text-body-m text-content-secondary md:col-span-2"
                    >
            <span className="md:hidden">
              Última actividad:{' '}
            </span>
                        {formatLastActivity(student.lastActivityAt)}
                    </div>

                    {/* Progress action */}
                    <div
                        role="cell"
                        className="md:col-span-2"
                    >
                        <Button
                            label="Ver progreso"
                            variant="ghost"
                            size="sm"
                            icon="arrow_forward"
                            iconPosition="end"
                            onClick={() => onViewProgress(student)}
                        />
                    </div>
                </TableRow>
            ))}
        </TableCard>
    )
}
