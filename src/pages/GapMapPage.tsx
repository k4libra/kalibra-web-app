/**
 * Course gap map page with coordinated summary and heatmap states.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { StudentHeatmap, SubtopicPriorityList } from '@/components/student-monitoring'
import { Button, Callout, EmptyState, LoadingState, PageHeader, StatCard } from '@/components/ui'
import { useGapMap } from '@/hooks/useStudentMonitoring'
import { formatMastery } from '@/utils/monitoring'

/** Shows the complete course gap map or insufficient-data state using {@link useGapMap}. */
export function GapMapPage() {
  const page = useGapMap()
  if (page.isLoading) return <LoadingState label="Cargando mapa de brechas…" />
  if (page.error || !page.map) return <>
    <PageHeader eyebrow="Mis cursos" title="Mapa de brechas" actions={<Button label="Ver estudiantes" variant="tonal" icon="group" onClick={page.viewStudents} />} />
    <Callout icon="error" tone="danger" action={<Button label="Reintentar" variant="neutral" onClick={page.refetch} />}>{page.error ?? 'No se pudo cargar el mapa de brechas.'}</Callout>
  </>
  const { course, courseSubtopics, gapMap, progress } = page.map
  const hasActivity = gapMap.stats.activeStudents > 0
  const weakest = gapMap.subtopics.find((item) => item.subtopicId === gapMap.stats.weakestSubtopicId)
  return <>
    <PageHeader eyebrow={`Mis cursos › ${course.name}`} title="Mapa de brechas"
      description={hasActivity ? 'Qué tan bien domina tu grupo cada subtema, para priorizar qué reforzar en clase y a quién apoyar.' : 'Dominio estimado del grupo por subtema, para priorizar qué reforzar en clase.'}
      actions={<Button label="Ver estudiantes" icon="group" variant="tonal" onClick={page.viewStudents} />} />
    {hasActivity ? <>
      <section aria-label="Resumen del mapa de brechas" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon="insights" value={formatMastery(gapMap.stats.averageMastery)} label="Dominio promedio del grupo" />
        <StatCard icon="monitoring" tone="danger" value={formatMastery(weakest?.averageMastery ?? null)} label="Subtema más débil" />
        <StatCard icon="group" tone="success" value={`${gapMap.stats.activeStudents} de ${gapMap.stats.totalStudents}`} label="Estudiantes con actividad" />
      </section>
      <SubtopicPriorityList subtopics={courseSubtopics} gaps={gapMap.subtopics} totalStudents={gapMap.stats.totalStudents} updatedAt={gapMap.updatedAt} />
      <StudentHeatmap subtopics={courseSubtopics} progress={progress} onViewProgress={page.viewProgress} />
    </> : <>
      <EmptyState icon="insights" title="Aún no hay datos suficientes" className="py-14"
        description="El mapa se construirá cuando tus estudiantes resuelvan ejercicios. Así evitamos mostrarte estimaciones de dominio poco confiables." />
      <Callout icon="info">Kalibra necesita respuestas registradas en cada subtema para estimar el dominio agregado del grupo.</Callout>
    </>}
  </>
}
