/**
 * Table of editable course subtopics.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { TableCard, TableHeader } from '@/components/ui'
import { SubtopicEditorRow } from './SubtopicEditorRow'
import type { Subtopic, UpdateSubtopicInput } from '@/types/course'

/** Props accepted by {@link SubtopicsTable}. */
export interface SubtopicsTableProps {
  /** Visible subtopics in their defined order. */
  subtopics: Subtopic[]
  /** Total rows, including hidden archived subtopics. */
  total: number
  /** Blocks actions during mutation or reload. */
  isSubmitting: boolean
  /** Saves names or positions and reports success. */
  onUpdate: (id: string, input: UpdateSubtopicInput) => Promise<boolean>
  /** Requests status change confirmation. */
  onStatus: (subtopic: Subtopic) => void
  /** Requests deletion confirmation. */
  onDelete: (subtopic: Subtopic) => void
}

/** Lists curriculum rows and emits editing, ordering and confirmation actions. */
export function SubtopicsTable({ subtopics, total, isSubmitting, onUpdate, onStatus, onDelete }: SubtopicsTableProps) {
  return (
    <TableCard label="Subtemas del curso">
      <TableHeader columns={['#', 'Subtema', 'Material y progreso', 'Acciones']}
        cellClassNames={['md:col-span-1', 'md:col-span-4', 'md:col-span-3', 'md:col-span-4']} className="md:grid-cols-12" />
      {subtopics.map((subtopic) => (
        <SubtopicEditorRow key={subtopic.id} subtopic={subtopic} total={total} isSubmitting={isSubmitting}
          onRename={(name) => onUpdate(subtopic.id, { name })}
          onMove={(displayOrder) => { void onUpdate(subtopic.id, { displayOrder }) }}
          onStatus={() => onStatus(subtopic)} onDelete={() => onDelete(subtopic)} />
      ))}
    </TableCard>
  )
}
