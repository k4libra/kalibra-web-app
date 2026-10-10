/**
 * Presents the institutional critical-subtopic ranking and mastery distributions.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, Callout, Chip, EmptyState, LoadingState, PageHeader, StackedBar, TableCard, TableHeader, TableRow } from '@/components/ui'
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
        <TableHeader columns={['Prioridad', 'Curso y subtema', 'Dominio del grupo', 'Distribución']} cellClassNames={['md:col-span-1', 'md:col-span-3', 'md:col-span-2', 'md:col-span-6']} className="md:grid-cols-12" />
        {page.data.map((item, index) => {
          const measured = item.lowCount + item.mediumCount + item.highCount
          const mastery = measured ? item.groupMastery : null
          const tone = masteryTone(mastery)
          const label = mastery === null ? 'Sin datos' : tone === 'danger' ? 'Dominio bajo' : tone === 'warning' ? 'Dominio medio' : 'Dominio alto'
          return <TableRow key={`${item.courseId}:${item.subtopicId}`} className="md:grid-cols-12">
            <span role="cell" className="text-headline-m md:col-span-1">{index + 1}</span>
            <div role="cell" className="md:col-span-3"><p className="text-title">{item.subtopicName}</p><p className="text-body-m text-content-secondary">{item.courseName}</p></div>
            <div role="cell" className="flex flex-col gap-2 md:col-span-2"><span className="text-title">{formatMastery(mastery)}</span><Chip label={label} tone={tone} /></div>
            <div role="cell" className="flex flex-col gap-2 md:col-span-6">
              <StackedBar label={`Distribución del dominio en ${item.subtopicName}`} segments={[
                { label: 'Bajo', value: item.lowCount, tone: 'danger' }, { label: 'Medio', value: item.mediumCount, tone: 'warning' },
                { label: 'Alto', value: item.highCount, tone: 'success' }, { label: 'Sin datos', value: item.noDataCount, tone: 'neutral' },
              ]} />
              <p className="text-body-m text-content-secondary">Bajo: {item.lowCount} · Medio: {item.mediumCount} · Alto: {item.highCount} · Sin datos: {item.noDataCount}</p>
            </div>
          </TableRow>
        })}
      </TableCard>
      <Callout icon="info">El dominio se estima con la práctica: bajo, menos de 40 %; medio, de 40 % a menos de 70 %; alto, desde 70 %. Sin datos significa que aún no hay una estimación.</Callout>
    </> : <EmptyState icon="insights" title="Aún no hay subtemas críticos" description="El ranking aparecerá cuando haya estimaciones de dominio en los cursos." />}
  </>
}
