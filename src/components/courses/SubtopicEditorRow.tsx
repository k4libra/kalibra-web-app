/**
 * Presents one curriculum row with safe editing and ordering controls.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { Chip, Icon, IconButton, MaterialStatusChip, ProgressBar, TableRow, TextField } from '@/components/ui'
import type { Subtopic } from '@/types/course'
import { masteryTone } from '@/utils/mastery'

/** Props accepted by {@link SubtopicEditorRow}. */
export interface SubtopicEditorRowProps {
  /** Persisted row, including server ordering and lock state. */
  subtopic: Subtopic
  /** Total rows, including archived rows, for ordering boundaries. */
  total: number
  /** Blocks actions while saving or refreshing. */
  isSubmitting: boolean
  /** Saves an unlocked name and reports success. */
  onRename: (name: string) => Promise<boolean>
  /** Moves to an absolute position among all rows. */
  onMove: (displayOrder: number) => void
  /** Requests archive or restore confirmation. */
  onStatus: () => void
  /** Requests deletion confirmation. */
  onDelete: () => void
}

/** Displays progress and emits rename, reorder, status and deletion actions. */
export function SubtopicEditorRow({ subtopic, total, isSubmitting, onRename, onMove, onStatus, onDelete }: SubtopicEditorRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(subtopic.name)
  const save = async () => {
    if (name.trim() && !subtopic.locked && !isSubmitting && await onRename(name.trim())) setIsEditing(false)
  }
  return (
    <TableRow className={`md:grid-cols-12 ${subtopic.status === 'ARCHIVED' ? 'opacity-60' : ''}`}>
      <span role="cell" className="text-label-l text-primary md:col-span-1">{String(subtopic.order).padStart(2, '0')}</span>
      <div role="cell" className="flex flex-col gap-2 md:col-span-4">
        <div className="flex items-center gap-2">
          {isEditing && !subtopic.locked ? (
            <>
              <TextField label={`Nombre de ${subtopic.name}`} hideLabel value={name} onChange={setName} disabled={isSubmitting} onSubmit={() => void save()} className="min-w-0 flex-1" />
              <IconButton icon="check" label={`Guardar nombre de ${subtopic.name}`} disabled={isSubmitting || !name.trim()} onClick={() => void save()} />
              <IconButton icon="close" label="Cancelar cambio de nombre" disabled={isSubmitting} onClick={() => setIsEditing(false)} />
            </>
          ) : (
            <>
              <span className="text-title text-content-primary">{subtopic.name}</span>
              {subtopic.locked ? (
                <span tabIndex={0} title="Tiene material: no se puede renombrar ni eliminar">
                  <Icon name="lock" label="Tiene material: no se puede renombrar ni eliminar" />
                </span>
              ) : <IconButton icon="edit" label={`Renombrar ${subtopic.name}`} disabled={isSubmitting} onClick={() => { setName(subtopic.name); setIsEditing(true) }} />}
            </>
          )}
        </div>
        {subtopic.status === 'ARCHIVED' && <Chip label="Archivado" tone="neutral" />}
        {subtopic.description && <span className="text-body-m text-content-secondary">{subtopic.description}</span>}
      </div>
      <div role="cell" className="flex flex-col gap-2 md:col-span-3">
        <MaterialStatusChip status={subtopic.materialStatus} />
        <span className="text-body-m text-content-secondary">{subtopic.approvedExerciseCount} ejercicios aprobados</span>
        <ProgressBar value={subtopic.averageMastery} tone={masteryTone(subtopic.averageMastery)} label={`Dominio promedio en ${subtopic.name}`} />
        <span className="text-body-m text-content-secondary">{subtopic.averageMastery === null ? 'Sin datos' : `${subtopic.averageMastery}%`}</span>
      </div>
      <div role="cell" className="flex flex-wrap gap-1 md:col-span-4">
        <IconButton icon="arrow_upward" label={`Subir ${subtopic.name}`} disabled={isSubmitting || subtopic.order <= 1} onClick={() => onMove(subtopic.order - 1)} />
        <IconButton icon="arrow_downward" label={`Bajar ${subtopic.name}`} disabled={isSubmitting || subtopic.order >= total} onClick={() => onMove(subtopic.order + 1)} />
        <IconButton icon={subtopic.status === 'ACTIVE' ? 'pause' : 'play_arrow'} label={`${subtopic.status === 'ACTIVE' ? 'Archivar' : 'Restaurar'} ${subtopic.name}`} disabled={isSubmitting} onClick={onStatus} />
        {!subtopic.locked && <IconButton icon="close" label={`Eliminar ${subtopic.name}`} disabled={isSubmitting} onClick={onDelete} />}
      </div>
    </TableRow>
  )
}
