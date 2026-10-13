/**
 * Presents one curriculum row with safe editing and ordering controls.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { ActionMenu, ArchiveIcon, Button, Icon, MaterialStatusChip, ProgressBar, TableRow, TextField } from '@/components/ui'
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
  /** Requests archive confirmation. */
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
    <TableRow className="grid curriculum-mobile-grid md:curriculum-grid">
      <span role="cell" className="text-label-l text-primary col-start-1 row-start-1">{String(subtopic.order).padStart(2, '0')}</span>
      <div role="cell" className="flex min-w-0 flex-col gap-2 col-start-1 row-start-2 md:col-start-2 md:row-start-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {isEditing && !subtopic.locked ? (
            <>
              <TextField label={`Nombre de ${subtopic.name}`} hideLabel value={name} onChange={setName} disabled={isSubmitting} onSubmit={() => void save()} className="min-w-0 flex-1" />
              <Button size="sm" label="Guardar" disabled={isSubmitting || !name.trim()} onClick={() => void save()} />
              <Button size="sm" variant="neutral" label="Cancelar" disabled={isSubmitting} onClick={() => setIsEditing(false)} />
            </>
          ) : (
            <>
              <span className="break-words text-title text-content-primary">{subtopic.name}</span>
              {subtopic.locked ? (
                <span tabIndex={0} title="Tiene material: archívalo en lugar de eliminarlo">
                  <Icon name="lock" label="Tiene material: archívalo en lugar de eliminarlo" />
                </span>
               ) : null}
            </>
          )}
        </div>
        {subtopic.description && <span className="text-body-m text-content-secondary">{subtopic.description}</span>}
      </div>
      <div role="cell" className="flex min-w-0 flex-col gap-2 col-start-1 row-start-3 md:col-start-3 md:row-start-1">
        <MaterialStatusChip status={subtopic.materialStatus} />
        <span className="text-body-m text-content-secondary">{subtopic.approvedExerciseCount} ejercicios aprobados</span>
        <ProgressBar value={subtopic.averageMastery} tone={masteryTone(subtopic.averageMastery)} label={`Dominio promedio en ${subtopic.name}`} />
        <span className="text-body-m text-content-secondary">{subtopic.averageMastery === null ? 'Sin datos' : `${subtopic.averageMastery}%`}</span>
      </div>
      <div role="cell" className="w-actions col-start-2 row-start-1 row-span-3 justify-self-end md:col-start-4 md:row-span-1">
        <ActionMenu label={`Acciones de ${subtopic.name}`} disabled={isSubmitting} items={[
          { id: 'rename', label: 'Renombrar', icon: 'edit', disabled: subtopic.locked,
            disabledReason: 'Tiene material: archívalo en lugar de eliminarlo',
            onSelect: () => { setName(subtopic.name); setIsEditing(true) } },
          { id: 'up', label: 'Mover arriba', icon: 'arrow_upward', disabled: subtopic.order <= 1,
            disabledReason: 'Es el primer subtema del curso', onSelect: () => onMove(subtopic.order - 1) },
          { id: 'down', label: 'Mover abajo', icon: 'arrow_downward', disabled: subtopic.order >= total,
            disabledReason: 'Es el último subtema del curso', onSelect: () => onMove(subtopic.order + 1) },
          { id: 'archive', label: 'Archivar', icon: ArchiveIcon, onSelect: onStatus },
          { id: 'delete', label: 'Eliminar', icon: 'delete', danger: true, disabled: subtopic.locked,
            disabledReason: 'Tiene material: archívalo en lugar de eliminarlo', onSelect: onDelete },
        ]} />
      </div>
    </TableRow>
  )
}
