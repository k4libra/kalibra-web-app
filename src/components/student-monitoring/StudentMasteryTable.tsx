/**
 * Individual mastery composition built from shared UI primitives.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { Card, Chip, ProgressBar, SectionHeader, TableCard, TableRow } from '@/components/ui'
import type { Subtopic } from '@/types/course'
import type { StudentSubtopicMastery } from '@/types/studentMonitoring'
import type { IconName, Tone } from '@/types/ui'
import { masteryTone } from '@/utils/mastery'
import { formatMastery } from '@/utils/monitoring'
import { plural } from '@/utils/plural'

/** Status labels and icons classified by the shared mastery rule. */
const STATUS: Record<Tone, { label: string; icon: IconName }> = {
  primary: { label: 'Dominio estimado', icon: 'insights' },
  success: { label: 'Dominio alto', icon: 'trending_up' },
  warning: { label: 'Dominio medio', icon: 'arrow_forward' },
  danger: { label: 'Dominio bajo', icon: 'monitoring' },
  neutral: { label: 'Sin datos', icon: 'hourglass_empty' },
}

/** Props accepted by {@link StudentMasteryTable}. */
export interface StudentMasteryTableProps {
  /** Course subtopics in curriculum order. */
  subtopics: Subtopic[]
  /** Measurements of the selected student. */
  masteryRecords: StudentSubtopicMastery[]
}

/** Shows the student's mastery, level and exercise count for each subtopic. */
export function StudentMasteryTable({ subtopics, masteryRecords }: StudentMasteryTableProps) {
  return <Card padding="lg" as="section">
    <SectionHeader title="Dominio estimado por subtema" subtitle="Se actualiza con cada respuesta que el estudiante envía" />
    <TableCard label="Dominio estimado por subtema" className="mt-4 rounded-none shadow-none">
      {subtopics.map((subtopic) => {
        const record = masteryRecords.find((item) => item.subtopicId === subtopic.id)
        const mastery = record?.mastery ?? null
        const tone = masteryTone(mastery)
        const count = record?.resolvedExercises ?? 0
        return <TableRow key={subtopic.id} className="border-t px-0 md:grid-cols-10">
          <span role="cell" className="text-title md:col-span-3">{subtopic.name}</span>
          <div role="cell" className="flex items-center gap-5 md:col-span-4">
            <ProgressBar value={mastery} label={`Dominio en ${subtopic.name}`} tone={tone} size="lg" />
            <span className="w-10 shrink-0 text-right text-title">{formatMastery(mastery)}</span>
          </div>
          <span role="cell" className="md:col-span-2"><Chip label={STATUS[tone].label} icon={STATUS[tone].icon} tone={tone} /></span>
          <span role="cell" className="text-body-m text-content-secondary md:text-right">{count ? plural(count, 'ejercicio', 'ejercicios') : 'Sin ejercicios'}</span>
        </TableRow>
      })}
    </TableCard>
  </Card>
}
