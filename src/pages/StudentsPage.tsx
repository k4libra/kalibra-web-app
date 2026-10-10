/**
 * Teacher student roster page grouped by course.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { CourseStudentsGroup } from '@/components/student-monitoring'
import { Button, Callout, EmptyState, LoadingState, PageHeader, StatCard } from '@/components/ui'
import { useMonitoredStudents } from '@/hooks/useStudentMonitoring'

/** Shows course-grouped enrollments and their entry points using {@link useMonitoredStudents}. */
export function StudentsPage() {
  const page = useMonitoredStudents()
  return <>
    <PageHeader eyebrow="Panel docente" title="Estudiantes" description="Tus estudiantes matriculados, agrupados por curso. Revisa el progreso individual de quien necesite seguimiento."
      actions={!page.isLoading && !page.error && page.groups.length > 0 ? <Button label="Invitar estudiante" icon="person_add" onClick={page.inviteStudent} /> : undefined} />
    {page.isLoading ? <LoadingState label="Cargando estudiantes…" /> : page.error ?
      <Callout icon="error" tone="danger" action={<Button label="Reintentar" variant="neutral" onClick={page.refetch} />}>{page.error}</Callout> :
      page.groups.length === 0 ? <EmptyState icon="group" title="Aún no tienes estudiantes"
        description="Crea tu primer curso para invitar a tus estudiantes. Aparecerán aquí agrupados por curso cuando acepten la invitación."
        className="py-14" action={<Button label="Crear mi primer curso" icon="add" onClick={page.createFirstCourse} />} /> : <>
        <section aria-label="Resumen de estudiantes" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard icon="group" value={`${page.stats.totalStudents}`} label="Matriculados" />
          <StatCard icon="bolt" tone="success" value={`${page.stats.activeStudents}`} label="Con actividad" />
          <StatCard icon="person" tone="warning" value={`${page.stats.inactiveStudents}`} label="Sin actividad aún" />
        </section>
        {page.groups.map((group) => <CourseStudentsGroup key={group.course.id} {...group} updatedAt={page.updatedAt} onViewProgress={page.viewProgress} />)}
        <Callout icon="forward_to_inbox">Solo aparecen quienes aceptaron tu invitación. Revisa las pendientes o vencidas en Invitaciones.</Callout>
      </>}
  </>
}
