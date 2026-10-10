/**
 * Course groups for the teacher student roster.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Chip, Icon, SectionHeader } from '@/components/ui'
import type { CourseOverview } from '@/types/course'
import type { MonitoredStudent } from '@/types/studentMonitoring'
import { StudentTable } from '@/components/student-monitoring/StudentTable'

/** Props accepted by {@link CourseStudentsGroup}. */
export interface CourseStudentsGroupProps {
  /** Course metadata displayed in the group header. */
  course: CourseOverview
  /** Students enrolled in this course. */
  students: MonitoredStudent[]
  /** Snapshot timestamp used by activity labels. */
  updatedAt: string
  /** Called with the student whose progress should open. */
  onViewProgress: (studentId: string) => void
}

/** Lists a course roster or its inline enrollment notice and emits progress actions. */
export function CourseStudentsGroup({ course, students, updatedAt, onViewProgress }: CourseStudentsGroupProps) {
  return <section className="flex flex-col gap-3">
    <SectionHeader icon={course.icon} title={course.name} subtitle={`${course.code} · Ciclo ${course.term}`}
      trailing={<Chip label={`${students.length} matriculados`} tone="neutral" className="ml-auto" />} />
    {students.length ? <StudentTable students={students} updatedAt={updatedAt} onViewProgress={onViewProgress} /> :
      <div className="flex items-start gap-3 rounded-lg bg-surface-card p-5 text-body-l text-content-secondary sm:items-center">
        <Icon name="info" size="lg" /><p>Aún no hay estudiantes matriculados en este curso. Invítalos desde Invitaciones eligiendo {course.name}.</p>
      </div>}
  </section>
}
