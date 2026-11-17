/**
 * Presents the institutional critical-subtopic ranking and mastery distributions.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, Callout, EmptyState, LoadingState, PageHeader, ProgressBar, TableCard, TableHeader, TableRow } from '@/components/ui'
import { useCriticalSubtopics } from '@/hooks/useInstitutionalIndicators'
import { masteryTone } from '@/utils/mastery'
import { formatMastery } from '@/utils/monitoring'

/** Shows the server-ranked critical subtopics using the institutional resource hook. */
export function CriticalSubtopicsPage() {
  const page = useCriticalSubtopics()
  return <>
    <PageHeader eyebrow="ADMINISTRACIÓN" title="Subtemas críticos" description="Subtemas ordenados por prioridad de refuerzo en los cursos de la institución." />
    {page.isLoading ? <LoadingState label="Cargando subtemas críticos…" /> : page.error ?
      <Callout icon="error" tone="danger" action={<Button label="Reintentar" variant="neutral" onClick={page.refetch} />}>{page.error}</Callout> : page.data?.length ? <>
      <TableCard label="Ranking de subtemas críticos">
        <TableHeader columns={['#', 'Subtema y curso', 'Bajo / Medio / Alto', 'Sin datos', 'Dominio del grupo']} className="md:critical-grid" />
        {page.data.map((item, index) => {
          const measured = item.lowCount + item.mediumCount + item.highCount
          const mastery = measured ? item.groupMastery : null
          const tone = masteryTone(mastery)
          return <TableRow key={`${item.courseId}:${item.subtopicId}`} className="md:critical-grid">
            <span role="cell" className="text-label-l text-primary">{String(index + 1).padStart(2, '0')}</span>
            <div role="cell"><p className="text-title">{item.subtopicName}</p><p className="text-body-m text-content-secondary">{item.courseName}</p></div>
            <span role="cell" aria-label={`Bajo: ${item.lowCount} · Medio: ${item.mediumCount} · Alto: ${item.highCount}`} className="text-body-m text-content-secondary">{item.lowCount} / {item.mediumCount} / {item.highCount}</span>
            <span role="cell" className="text-body-m">{item.noDataCount}</span>
            <div role="cell" className="flex items-center gap-2.5"><ProgressBar value={mastery} tone={tone} label={`Dominio del grupo en ${item.subtopicName}`} /><span className="shrink-0 text-body-m-bold">{mastery === null ? 'Sin datos' : formatMastery(mastery)}</span></div>
          </TableRow>
        })}
      </TableCard>
    </> : <EmptyState icon="insights" title="Aún no hay subtemas críticos" description="El ranking aparecerá cuando haya estimaciones de dominio en los cursos." />}
  </>
}
