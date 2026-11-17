/**
 * Presents institution-wide analytics and per-course comparisons.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, Callout, ProgressBar, EmptyState, LoadingState, PageHeader, StatCard, TableCard, TableHeader, TableRow } from '@/components/ui'
import { useInstitutionalIndicators } from '@/hooks/useInstitutionalIndicators'
import { masteryTone } from '@/utils/mastery'
import { formatMastery } from '@/utils/monitoring'

/** Shows institution totals and course aggregates using the institutional resource hook. */
export function AdminPanelPage() {
  const page = useInstitutionalIndicators()
  const report = page.data
  return <>
    <PageHeader eyebrow="ADMINISTRACIÓN" title="Panel institucional" description="Actividad, respuestas y evolución del dominio de los cursos de la institución."
      actions={<Button label="Exportar CSV" icon="download" disabled={page.isLoading || !report?.courses.length || page.isExporting || Boolean(page.error)} onClick={page.download} />} />
    {page.isLoading ? <LoadingState label="Cargando indicadores institucionales…" /> : page.error ?
      <Callout icon="error" tone="danger" action={<Button label="Reintentar" variant="neutral" onClick={page.refetch} />}>{page.error}</Callout> : report && <>
      <section aria-label="Totales institucionales" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="school" value={`${report.totals.courses}`} label="Cursos" />
        <StatCard icon="person" tone="success" value={`${report.totals.teachers}`} label="Docentes" />
        <StatCard icon="task_alt" tone="warning" value={`${report.totals.activeStudents}`} label="Estudiantes con actividad" />
      </section>
      {report.courses.length ? <TableCard label="Indicadores por curso">
        <TableHeader columns={['#', 'Curso y docente', 'Actividad', 'Resueltos', 'Respuestas correctas', 'Verificación']} className="md:institutional-grid" />
        {report.courses.map((course, index) => <TableRow key={course.courseId} className="md:institutional-grid">
          <span role="cell" className="text-label-l text-primary">{String(index + 1).padStart(2, '0')}</span>
          <div role="cell"><p className="text-title">{course.name}</p><p className="text-body-m text-content-secondary">{course.code}{course.teacherName ? ` · ${course.teacherName}` : ''}</p></div>
          <span role="cell" className="text-body-l text-content-secondary">{course.activeStudents} de {course.enrolledStudents} con actividad</span>
          <span role="cell" className="text-body-l">{course.totalSolved}</span>
          <div role="cell" className="flex items-center gap-2.5"><ProgressBar value={course.groupAccuracy} tone={masteryTone(course.groupAccuracy)} label={`Respuestas correctas en ${course.name}`} /><span className="shrink-0 text-body-m-bold">{course.groupAccuracy === null ? 'Sin datos' : formatMastery(course.groupAccuracy)}</span></div>
          <span role="cell" className="text-body-l text-content-secondary">{formatMastery(course.verificationApprovalRate)}</span>
        </TableRow>)}
      </TableCard> : <EmptyState icon="school" title="Aún no hay cursos en la institución" description="Los indicadores aparecerán cuando los docentes creen cursos y sus estudiantes registren actividad." />}
      <Callout icon="lightbulb">La barra muestra el porcentaje de respuestas correctas; La evolución del dominio se expresa en puntos porcentuales; los ejercicios descartados nunca llegan a los estudiantes.</Callout>
    </>}
    {page.exportError && <Callout icon="error" tone="danger">{page.exportError}</Callout>}
  </>
}
