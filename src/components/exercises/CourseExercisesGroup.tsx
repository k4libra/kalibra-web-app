/**
 * Generated exercises of one course, grouped by subtopic.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Fragment } from 'react'
import { Button, Chip, Icon, SectionHeader, TableCard, TableHeader, TableRow } from '@/components/ui'
import type { CourseOverview } from '@/types/course'
import type { CourseExerciseCatalog } from '@/types/exercise'
import { cn } from '@/utils/cn'
import { plural } from '@/utils/plural'
import { VerificationChip } from './VerificationChip'

// Grid of the table from `md`: exercise, generated at, verification and action.
const GRID = 'md:grid-cols-12'
const CELLS = ['md:col-span-6', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2']

/**
 * Props accepted by {@link CourseExercisesGroup}.
 */
export interface CourseExercisesGroupProps {
  /** Course of the group. */
  course: CourseOverview
  /** Generated exercises of the course. */
  catalog: CourseExerciseCatalog
  /** Called with the id of the exercise the teacher opens. */
  onOpenExercise: (exerciseId: string) => void
  /** Called when the teacher wants to upload material for a course without exercises. */
  onUploadMaterial: (courseId: string) => void
}

/**
 * Lists the exercises of a course by subtopic with their verification, or invites to upload material when there are none.
 */
export function CourseExercisesGroup({ course, catalog, onOpenExercise, onUploadMaterial }: CourseExercisesGroupProps) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeader
        icon={course.icon}
        title={course.name}
        subtitle={`${course.code} · Ciclo ${course.term}`}
        trailing={<Chip label={plural(catalog.generatedCount, 'ejercicio', 'ejercicios')} tone="neutral" />}
      />
      {catalog.subtopics.length === 0 ? (
        <div className="flex flex-col gap-3 rounded-lg bg-surface-card p-4 shadow-card sm:flex-row sm:items-center">
          <Icon name="info" size="lg" className="text-content-secondary" />
          <p className="flex-1 text-body-l text-content-secondary">Aún no hay ejercicios: carga el material de sus subtemas para poder generarlos.</p>
          <Button label="Cargar material" icon="upload_file" variant="tonal" size="sm" onClick={() => onUploadMaterial(course.id)} />
        </div>
      ) : (
        <TableCard label={`Ejercicios generados de ${course.name}`}>
          <TableHeader columns={['Ejercicio', 'Generado', 'Verificación', 'Acción']} cellClassNames={CELLS} className={GRID} />
          {catalog.subtopics.map((group) => (
            <Fragment key={group.subtopicId}>
              <div role="row" className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-line-subtle bg-surface-background px-4 py-2.5 first:border-t-0">
                <Icon name="account_tree" className="text-primary" />
                <span role="cell" className="text-label-l text-content-primary">
                  {group.subtopicName}
                </span>
                <span className="text-body-m text-content-secondary">
                  {group.generatedCount} generados · {group.approvedCount} aprobados · {plural(group.discardedCount, 'descartado', 'descartados')}
                </span>
              </div>
              {group.exercises.map((exercise) => (
                <TableRow key={exercise.id} className={GRID}>
                  <span role="cell" className={cn('flex flex-col gap-0.5', CELLS[0])}>
                    <span className="text-label-l text-content-primary">{exercise.statement}</span>
                    <span className="text-body-m text-content-secondary">{exercise.summary}</span>
                  </span>
                  <span role="cell" className={cn('text-body-m text-content-secondary', CELLS[1])}>
                    {exercise.generatedAt}
                  </span>
                  <span role="cell" className={CELLS[2]}>
                    <VerificationChip status={exercise.status} />
                  </span>
                  <span role="cell" className={CELLS[3]}>
                    <Button label="Ver detalle" variant="tonal" size="sm" onClick={() => onOpenExercise(exercise.id)} />
                  </span>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableCard>
      )}
    </section>
  )
}
