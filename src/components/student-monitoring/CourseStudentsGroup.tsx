/**
 * Course groups for the teacher student roster.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, CourseGroup } from '@/components/ui'
import type { CourseOverview } from '@/types/course'
import type { MonitoredStudent } from '@/types/studentMonitoring'
import { StudentTable } from '@/components/student-monitoring/StudentTable'
import { plural } from '@/utils/plural'

/** Props accepted by {@link CourseStudentsGroup}. */
export interface CourseStudentsGroupProps {
  /** Course metadata displayed in the group header. */
  course: CourseOverview
  /** Students enrolled in this course. */
  students: MonitoredStudent[]
  /** Snapshot timestamp used by activity labels. */
  updatedAt: string
  /** Called with the student whose progress should open. */
  onViewProgress: (studentId: string, courseId?: string) => void
  /** Invites a student to this course. */
  onInvite?: (courseId: string) => void
}

/** Lists a course roster or its inline enrollment notice and emits progress actions. */
export function CourseStudentsGroup({ course, students, updatedAt, onViewProgress, onInvite }: CourseStudentsGroupProps) {
  return <CourseGroup course={course} countIcon="group" countLabel={plural(students.length, 'matriculado', 'matriculados')}
    emptyMessage={!students.length ? 'Aún no hay estudiantes matriculados en este curso.' : undefined}
    action={!students.length && onInvite ? <Button label={`Invitar a ${course.name}`} icon="person_add" variant="tonal" size="sm" onClick={() => onInvite(course.id)} /> : undefined}>
    {students.length > 0 && <StudentTable students={students} updatedAt={updatedAt} onViewProgress={(id) => onViewProgress(id, course.id)} />}
  </CourseGroup>
}
