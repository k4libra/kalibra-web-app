/**
 * Table of the subtopics of a course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { MaterialStatusChip, ProgressBar, TableCard, TableHeader, TableRow } from '@/components/ui'
import type { Subtopic } from '@/types/course'
import { masteryTone } from '@/utils/mastery'

// Grid of the table from `md`: order, subtopic, material, exercises and mastery.
const GRID = 'md:grid-cols-12'
const CELLS = ['md:col-span-1', 'md:col-span-4', 'md:col-span-3', 'md:col-span-2', 'md:col-span-2']

/**
 * Props accepted by {@link SubtopicsTable}.
 */
export interface SubtopicsTableProps {
  /** Subtopics in their defined order. */
  subtopics: Subtopic[]
}

/**
 * Lists each subtopic with its material state, approved exercises and group mastery.
 */
export function SubtopicsTable({ subtopics }: SubtopicsTableProps) {
  return (
    <TableCard label="Subtemas del curso">
      <TableHeader
        columns={['#', 'Subtema', 'Material curricular', 'Ejercicios aprobados', 'Dominio promedio']}
        cellClassNames={CELLS}
        className={GRID}
      />
      {subtopics.map((subtopic) => (
        <TableRow key={subtopic.id} className={GRID}>
          <span role="cell" className={`text-label-l text-primary ${CELLS[0]}`}>
            {String(subtopic.order).padStart(2, '0')}
          </span>
          <span role="cell" className={`flex flex-col gap-0.5 ${CELLS[1]}`}>
            <span className="text-title text-content-primary">{subtopic.name}</span>
            {subtopic.description && <span className="text-body-m text-content-secondary">{subtopic.description}</span>}
          </span>
          <span role="cell" className={CELLS[2]}>
            <MaterialStatusChip status={subtopic.materialStatus} />
          </span>
          <span role="cell" className={`text-body-l text-content-primary ${CELLS[3]}`}>
            <span className="text-content-secondary md:hidden">Ejercicios aprobados: </span>
            {subtopic.approvedExerciseCount}
          </span>
          <span role="cell" className={`flex items-center gap-2.5 ${CELLS[4]}`}>
            <ProgressBar
              value={subtopic.averageMastery}
              tone={masteryTone(subtopic.averageMastery)}
              label={`Dominio promedio en ${subtopic.name}`}
              className="max-w-24"
            />
            <span className={subtopic.averageMastery === null ? 'text-body-m text-content-muted' : 'text-body-m text-content-primary'}>
              {subtopic.averageMastery === null ? 'Sin datos' : `${subtopic.averageMastery}%`}
            </span>
          </span>
        </TableRow>
      ))}
    </TableCard>
  )
}
