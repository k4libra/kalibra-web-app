/**
 * Subtopic reinforcement priorities and mastery distributions.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { Card, Chip, Legend, SectionHeader, StackedBar } from '@/components/ui'
import type { Subtopic } from '@/types/course'
import type { SubtopicGap } from '@/types/studentMonitoring'
import type { IconName, Tone } from '@/types/ui'
import { HIGH_MASTERY_THRESHOLD, LOW_MASTERY_THRESHOLD, masteryTone } from '@/utils/mastery'
import { formatMastery, formatMonitoringActivity } from '@/utils/monitoring'
import { plural } from '@/utils/plural'

/** Priority labels and icons for the shared mastery tones. */
const PRIORITY: Record<Tone, { label: string; icon: IconName }> = {
  primary: { label: 'Dominio estimado', icon: 'insights' }, success: { label: 'Buen avance', icon: 'trending_up' },
  warning: { label: 'En progreso', icon: 'arrow_forward' }, danger: { label: 'Reforzar en clase', icon: 'priority_high' },
  neutral: { label: 'Sin práctica aún', icon: 'hourglass_empty' },
}

/** Props accepted by {@link SubtopicPriorityList}. */
export interface SubtopicPriorityListProps {
  /** Course labels in curriculum order. */
  subtopics: Subtopic[]
  /** Aggregate measurements to sort by reinforcement priority. */
  gaps: SubtopicGap[]
  /** Number of enrolled students used by the subtitle. */
  totalStudents: number
  /** Snapshot timestamp of the map. */
  updatedAt: string
}

/** Lists subtopics by reinforcement priority with level distributions. */
export function SubtopicPriorityList({ subtopics, gaps, totalStudents, updatedAt }: SubtopicPriorityListProps) {
  const sorted = [...gaps].sort((a, b) => (a.averageMastery ?? Infinity) - (b.averageMastery ?? Infinity))
  return <Card as="section" padding="lg">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <SectionHeader title="Prioridad de refuerzo por subtema" subtitle={`Cuántos de tus ${plural(totalStudents, 'estudiante', 'estudiantes')} están en cada nivel · actualizado ${formatMonitoringActivity(updatedAt, updatedAt).toLowerCase()}`} />
      <Legend label="Niveles de dominio" items={[
        { label: `Bajo < ${LOW_MASTERY_THRESHOLD}%`, tone: 'danger' },
        { label: `Medio ${LOW_MASTERY_THRESHOLD}–${HIGH_MASTERY_THRESHOLD - 1}%`, tone: 'warning' },
        { label: `Alto ≥ ${HIGH_MASTERY_THRESHOLD}%`, tone: 'success' }, { label: 'Sin datos', tone: 'neutral' },
      ]} />
    </div>
    <div className="mt-4">
      {sorted.map((gap) => {
        const subtopic = subtopics.find((item) => item.id === gap.subtopicId)
        const tone = masteryTone(gap.averageMastery)
        const segments = [
          { label: 'bajo', value: gap.lowMasteryCount, tone: 'danger' as const },
          { label: 'medio', value: gap.mediumMasteryCount, tone: 'warning' as const },
          { label: 'alto', value: gap.highMasteryCount, tone: 'success' as const },
          { label: 'sin datos', value: gap.noDataCount, tone: 'neutral' as const },
        ]
        const distribution = segments.filter((item) => item.value).map((item) => `${item.value} ${item.label === 'sin datos' ? 'sin datos' : `en ${item.label}`}`).join(' · ')
        return <div key={gap.subtopicId} className="flex flex-col gap-3 border-t border-line-subtle py-4 md:grid md:grid-cols-10 md:items-center md:gap-4">
          <div className="flex flex-col gap-1.5 md:col-span-3"><h3 className="text-title">{subtopic?.name}</h3><Chip label={PRIORITY[tone].label} tone={tone} icon={PRIORITY[tone].icon} /></div>
          <div className="flex flex-col gap-2 md:col-span-6"><StackedBar label={`Distribución de ${subtopic?.name}: ${distribution}`} segments={segments} /><p className="text-body-m text-content-secondary">{distribution}{gap.studentsWithActivity === 0 ? ' · nadie ha practicado este subtema' : ''}</p></div>
          <div className="md:text-right"><p className="text-headline-l">{formatMastery(gap.averageMastery)}</p><p className="text-body-m text-content-secondary">promedio</p></div>
        </div>
      })}
    </div>
  </Card>
}
