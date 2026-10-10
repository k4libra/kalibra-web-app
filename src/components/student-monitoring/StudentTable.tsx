/**
 * Course roster with mastery bars and individual progress entry points.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { Avatar, Button, Chip, ProgressBar, TableCard, TableHeader, TableRow } from '@/components/ui'
import type { MonitoredStudent } from '@/types/studentMonitoring'
import { cn } from '@/utils/cn'
import { masteryTone } from '@/utils/mastery'
import { formatMastery, formatMonitoringActivity } from '@/utils/monitoring'

/** Column layout shared by the roster header and rows. */
const GRID = 'md:grid-cols-12'
const CELLS = ['md:col-span-5', 'md:col-span-1', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2']

/** Props accepted by {@link StudentTable}. */
export interface StudentTableProps {
  /** Students enrolled in one course. */
  students: MonitoredStudent[]
  /** Snapshot timestamp used by relative activity labels. */
  updatedAt: string
  /** Called with the identity of the student to open. */
  onViewProgress: (studentId: string) => void
}

/** Lists enrollments with mastery bars and emits individual progress actions. */
export function StudentTable({ students, updatedAt, onViewProgress }: StudentTableProps) {
  return <TableCard label="Estudiantes matriculados">
    <TableHeader columns={['Estudiante', 'Resueltos', 'Dominio promedio', 'Última actividad', 'Acción']} cellClassNames={CELLS} className={GRID} />
    {students.map((student) => <TableRow key={student.id} className={GRID}>
      <div role="cell" className={cn('flex min-w-0 items-center gap-2.5', CELLS[0])}>
        <Avatar initials={student.initials} size="sm" />
        <div className="min-w-0"><p className="text-label-l text-content-primary">{student.fullName}</p><p className="break-all text-body-m text-content-secondary">{student.email}</p></div>
      </div>
      <span role="cell" className={cn('text-label-l', CELLS[1])}>{student.resolvedExercises}</span>
      <div role="cell" className={cn('flex items-center gap-2.5', CELLS[2])}>
        <ProgressBar value={student.averageMastery} label={`Dominio de ${student.fullName}`} tone={masteryTone(student.averageMastery)} />
        <span className="shrink-0 text-body-m-bold text-content-secondary">{student.averageMastery === null ? 'Sin datos' : formatMastery(student.averageMastery)}</span>
      </div>
      <span role="cell" className={cn('text-body-m text-content-secondary', CELLS[3])}>
        {student.lastActivityAt ? formatMonitoringActivity(student.lastActivityAt, updatedAt) : <Chip label={student.resolvedExercises ? "Fecha no disponible" : "Sin actividad"} tone="neutral" icon="schedule" />}
      </span>
      <span role="cell" className={CELLS[4]}><Button label="Ver progreso" variant="tonal" size="sm" onClick={() => onViewProgress(student.id)} /></span>
    </TableRow>)}
  </TableCard>
}
