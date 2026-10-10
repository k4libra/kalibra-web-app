/**
 * Student heatmap composition with accessible progress entry points.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Avatar, Button, Card, HeatmapCell, SectionHeader, TableCard, TableHeader, TableRow } from '@/components/ui'
import type { Subtopic } from '@/types/course'
import type { StudentProgress } from '@/types/studentMonitoring'
import { masteryTone } from '@/utils/mastery'
import { formatMastery } from '@/utils/monitoring'

/** Props accepted by {@link StudentHeatmap}. */
export interface StudentHeatmapProps {
  /** Course subtopics in curriculum order. */
  subtopics: Subtopic[]
  /** Individual progress of every enrolled student, including students without activity. */
  progress: StudentProgress[]
  /** Called with the identity selected through a name or measurement. */
  onViewProgress: (studentId: string) => void
}

/** Shows a student by subtopic heatmap and emits individual progress navigation. */
export function StudentHeatmap({ subtopics, progress, onViewProgress }: StudentHeatmapProps) {
  return <Card padding="lg" as="section">
    <SectionHeader title="Dominio por estudiante y subtema" subtitle="Identifica quién necesita apoyo en cada subtema. Selecciona un estudiante para ver su progreso." />
    <TableCard label="Dominio por estudiante y subtema" className="mt-4 rounded-none shadow-none">
      <TableHeader columns={['Estudiante', ...subtopics.map((topic) => topic.name)]}
        cellClassNames={['md:col-span-2', ...subtopics.map(() => 'md:col-span-1')]}
        className="px-0 md:grid-cols-6" />
      {progress.map(({ student, subtopics: records }) => <TableRow key={student.id} className="px-0 md:grid-cols-6">
        <div role="cell" className="flex items-center gap-2 md:col-span-2"><Avatar initials={student.initials} size="sm" /><div className="min-w-0 flex-1"><Button label={student.fullName} variant="ghost" size="sm" fullWidth className="h-auto whitespace-normal text-left" onClick={() => onViewProgress(student.id)} /></div></div>
        {subtopics.map((topic) => {
          const mastery = records.find((record) => record.subtopicId === topic.id)?.mastery ?? null
          return <div role="cell" key={topic.id}>
            <p className="mb-1 text-body-m text-content-secondary md:hidden">{topic.name}</p>
            <HeatmapCell value={formatMastery(mastery)} tone={masteryTone(mastery)} label={`Ver progreso de ${student.fullName}: ${topic.name}, ${mastery === null ? 'sin datos' : formatMastery(mastery)}`} onClick={() => onViewProgress(student.id)} />
          </div>
        })}
      </TableRow>)}
    </TableCard>
  </Card>
}
