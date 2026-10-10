/**
 * Card of a course in the list of the teacher.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, Card, Chip, Icon, IconBox, ProgressBar } from '@/components/ui'
import type { CourseOverview } from '@/types/course'
import type { IconName } from '@/types/ui'

/**
 * Props accepted by {@link CourseCard}.
 */
export interface CourseCardProps {
  /** Course to show. */
  course: CourseOverview
  /** Called when the teacher chooses to manage the course. */
  onManage: (courseId: string) => void
}

/**
 * Renders one counter of the card.
 */
function Metric({ icon, value, label }: { icon: IconName; value: number; label: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md bg-primary-subtle p-3">
      <span className="flex items-center gap-1.5">
        <Icon name={icon} size="sm" className="text-primary" />
        <span className="text-headline-m text-content-primary">{value}</span>
      </span>
      <span className="text-body-m text-content-secondary">{label}</span>
    </div>
  )
}

/**
 * Shows the counters and group mastery of a course and emits when the teacher opens it.
 */
export function CourseCard({ course, onManage }: CourseCardProps) {
  const meta = [course.faculty, course.semester, `Código ${course.code}`].filter(Boolean).join(' · ')
  return (
    <Card as="article" padding="lg" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <IconBox icon={course.icon} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="text-headline-m text-content-primary">{course.name}</h3>
          <p className="text-body-m text-content-secondary">{meta}</p>
        </div>
        {course.term && <Chip label={`Ciclo ${course.term}`} tone="neutral" />}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric icon="account_tree" value={course.subtopicCount} label="Subtemas" />
        <Metric icon="description" value={course.materialCount} label="Materiales" />
        <Metric icon="quiz" value={course.approvedExerciseCount} label="Ejercicios" />
        <Metric icon="group" value={course.studentCount} label="Estudiantes" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-body-m">
          <span className="text-content-secondary">Dominio promedio del grupo</span>
          {course.averageMastery === null ? (
            <span className="text-body-m-bold text-content-muted">Sin datos</span>
          ) : (
            <span className="text-body-m-bold text-primary-strong">{course.averageMastery}%</span>
          )}
        </div>
        <ProgressBar value={course.averageMastery} label={`Dominio promedio del grupo en ${course.name}`} />
      </div>
      <Button label="Gestionar curso" variant="tonal" icon="arrow_forward" iconPosition="end" fullWidth onClick={() => onManage(course.id)} />
    </Card>
  )
}
