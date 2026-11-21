/**
 * Teacher student roster page grouped by course.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { CourseStudentsGroup } from '@/components/student-monitoring'
import { useState } from 'react'
import { CourseFilter, StatStrip, StatItem, Button, Callout, EmptyState, LoadingState, PageHeader } from '@/components/ui'
import { useMonitoredStudents } from '@/hooks/useStudentMonitoring'

/** Shows course-grouped enrollments and their entry points using {@link useMonitoredStudents}. */
export function StudentsPage() {
  const page = useMonitoredStudents()
  const [courseFilter, setCourseFilter] = useState('')
  const visibleGroups = page.groups.filter((group) => !courseFilter || group.course.id === courseFilter)
  return <div className="-mt-1 flex flex-col gap-4">
    <PageHeader eyebrow="Panel docente" title="Estudiantes" description="Tus estudiantes matriculados, agrupados por curso. Revisa el progreso individual de quien necesite seguimiento."
      helperIcon="how_to_reg"
        helper="Solo aparecen quienes aceptaron tu invitación; revisa las pendientes o vencidas en Invitaciones."
      actions={!page.isLoading && !page.error && page.groups.length > 0 ? <Button label="Invitar estudiante" icon="person_add" onClick={page.inviteStudent} /> : undefined} />
    {page.isLoading ? <LoadingState label="Cargando estudiantes…" /> : page.error ?
      <Callout icon="error" tone="danger" action={<Button label="Reintentar" variant="neutral" onClick={page.refetch} />}>{page.error}</Callout> :
      page.groups.length === 0 ? <EmptyState icon="group" title="Aún no tienes estudiantes"
        description="Crea tu primer curso para invitar a tus estudiantes. Aparecerán aquí agrupados por curso cuando acepten la invitación."
        className="py-14" action={<Button label="Crear mi primer curso" icon="add" onClick={page.createFirstCourse} />} /> : <>
        <StatStrip label="Resumen de estudiantes">
          <StatItem icon="group" value={`${page.stats.totalStudents}`} label="Matriculados" />
          <StatItem icon="bolt" tone="success" value={`${page.stats.activeStudents}`} label="Con actividad" />
          <StatItem icon="hourglass_empty" tone="warning" value={`${page.stats.inactiveStudents}`} label="Sin actividad aún" />
        </StatStrip>
        <CourseFilter value={courseFilter} onChange={setCourseFilter} courses={page.groups.map((group) => ({ id: group.course.id, name: group.course.name, count: group.students.length }))} />
        {visibleGroups.map((group) => <CourseStudentsGroup key={group.course.id} {...group} updatedAt={page.updatedAt} onViewProgress={page.viewProgress} onInvite={page.inviteStudent} />)}

      </>}
  </div>
}
