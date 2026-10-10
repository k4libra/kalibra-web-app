/**
 * Presents institution-wide analytics and per-course comparisons.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, Callout, ComparisonBar, EmptyState, LoadingState, PageHeader, StatCard, TableCard, TableHeader, TableRow } from '@/components/ui'
import { useInstitutionalIndicators } from '@/hooks/useInstitutionalIndicators'
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
      <section aria-label="Totales institucionales" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="school" value={`${report.totals.courses}`} label="Cursos" />
        <StatCard icon="person" value={`${report.totals.teachers}`} label="Docentes" />
        <StatCard icon="group" value={`${report.totals.enrolledStudents}`} label="Estudiantes matriculados" />
        <StatCard icon="task_alt" value={`${report.totals.activeStudents}`} label="Estudiantes con actividad" />
        <StatCard icon="quiz" value={`${report.totals.totalSolved}`} label="Ejercicios resueltos" />
        <StatCard icon="fact_check" value={formatMastery(report.totals.groupAccuracy)} label="Respuestas correctas" />
        <StatCard icon="trending_up" value={report.totals.groupDeltaPoints === null ? '—' : `${report.totals.groupDeltaPoints > 0 ? '+' : ''}${report.totals.groupDeltaPoints} pp`} label="Evolución del dominio" />
        <StatCard icon="verified" value={formatMastery(report.totals.verificationApprovalRate)} label="Aprobación de verificación" />
      </section>
      {report.courses.length ? <TableCard label="Indicadores por curso">
        <TableHeader columns={['Curso y docente', 'Actividad', 'Resueltos', 'Respuestas correctas', 'Evolución', 'Verificación']} className="md:grid-cols-6" />
        {report.courses.map((course) => <TableRow key={course.courseId} className="md:grid-cols-6">
          <div role="cell"><p className="text-title">{course.name}</p><p className="text-body-m text-content-secondary">{course.code}{course.teacherName ? ` · ${course.teacherName}` : ''}</p></div>
          <span role="cell" className="text-body-m">{course.activeStudents} de {course.enrolledStudents} con actividad</span>
          <span role="cell" className="text-body-l">{course.totalSolved}</span>
          <div role="cell" className="flex flex-col gap-2"><span className="text-body-m">{formatMastery(course.groupAccuracy)}</span>
            <ComparisonBar value={course.groupAccuracy} marker={report.totals.groupAccuracy} tone="primary" label={`Respuestas correctas en ${course.name} frente al promedio institucional`} /></div>
          <span role="cell" className="text-body-m">{course.groupDeltaPoints === null ? 'Sin datos' : `${course.groupDeltaPoints > 0 ? '+' : ''}${course.groupDeltaPoints} pp`}</span>
          <span role="cell" className="text-body-m">{formatMastery(course.verificationApprovalRate)}</span>
        </TableRow>)}
      </TableCard> : <EmptyState icon="school" title="Aún no hay cursos en la institución" description="Los indicadores aparecerán cuando los docentes creen cursos y sus estudiantes registren actividad." />}
      <Callout icon="info">La marca de cada barra muestra el promedio institucional de respuestas correctas. La evolución del dominio se expresa en puntos porcentuales; los ejercicios descartados nunca llegan a los estudiantes.</Callout>
    </>}
    {page.exportError && <Callout icon="error" tone="danger">{page.exportError}</Callout>}
  </>
}
