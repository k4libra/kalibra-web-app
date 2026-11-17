/**
 * Generated exercises of one course, grouped by subtopic.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Fragment } from 'react'
import { Button, Chip, CourseGroup, Icon, IconBox, IconButton, TableCard, TableHeader, TableRow } from '@/components/ui'
import type { CourseOverview } from '@/types/course'
import type { CourseExerciseCatalog } from '@/types/exercise'
import { cn } from '@/utils/cn'
import { plural } from '@/utils/plural'
import { VerificationChip } from './VerificationChip'

// Grid of the table from `md`: exercise, generated at, verification and action.
const GRID = 'md:grid-cols-12'
const CELLS = ['md:col-span-7', 'md:col-span-2', 'md:col-span-2', 'md:col-span-1']

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
    <CourseGroup course={course} countIcon="quiz" countLabel={plural(catalog.generatedCount, 'ejercicio', 'ejercicios')}
      emptyMessage={!catalog.subtopics.length ? 'Aún no hay ejercicios: carga el material de sus subtemas para generarlos.' : undefined}
      action={!catalog.subtopics.length ? <Button label="Cargar material" icon="upload_file" variant="tonal" size="sm" onClick={() => onUploadMaterial(course.id)} /> : undefined}>
      {catalog.subtopics.length > 0 && (
        <TableCard label={`Ejercicios generados de ${course.name}`}>
          <TableHeader columns={['Ejercicio', 'Generado', 'Verificación', 'Acción']} cellClassNames={CELLS} className={GRID} />
          {catalog.subtopics.map((group) => (
            <Fragment key={group.subtopicId}>
              <div role="row" className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-line-subtle bg-primary-subtle px-6 py-2 first:border-t-0">
                <Icon name="account_tree" className="text-primary" />
                <span role="cell" className="flex-1 text-label-l text-content-primary">
                  {group.subtopicName}
                </span>
                <Chip label={`${group.generatedCount} generados`} tone="neutral" />
                <Chip label={`${group.approvedCount} aprobados`} tone="success" icon="check_circle" />
                <Chip label={plural(group.discardedCount, 'descartado', 'descartados')} tone="danger" icon="cancel" />
              </div>
              {group.exercises.map((exercise) => (
                <TableRow key={exercise.id} className={GRID}>
                  <span role="cell" className={cn('flex items-center gap-3', CELLS[0])}>
                    <IconBox icon="quiz" tone={exercise.status === 'approved' ? 'success' : 'danger'} size="sm" /><span className="min-w-0"><span className="block text-label-l text-content-primary line-clamp-2">{exercise.statement}</span><span className="block text-body-m text-content-secondary">{exercise.summary}</span></span>
                  </span>
                  <span role="cell" className={cn('text-body-m text-content-secondary', CELLS[1])}>
                    {exercise.generatedAt}
                  </span>
                  <span role="cell" className={CELLS[2]}>
                    <VerificationChip status={exercise.status} />
                  </span>
                  <span role="cell" className={CELLS[3]}>
                    <IconButton variant="tinted" size="sm" icon="chevron_right" label={`Ver detalle: ${exercise.statement}`} className="size-8 bg-primary-subtle text-primary shadow-none" onClick={() => onOpenExercise(exercise.id)} />
                  </span>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableCard>
      )}
    </CourseGroup>
  )
}
