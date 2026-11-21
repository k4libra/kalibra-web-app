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
  /** Saves the optional description, including when the name is locked. */
  onDescription: (description: string) => Promise<boolean>
  /** Moves to an absolute position among all rows. */
  onMove: (displayOrder: number) => void
  /** Requests archive confirmation. */
  onStatus: () => void
  /** Requests deletion confirmation. */
  onDelete: () => void
}

/** Displays progress and emits rename, reorder, status and deletion actions. */
export function SubtopicEditorRow({ subtopic, total, isSubmitting, onRename, onDescription, onMove, onStatus, onDelete }: SubtopicEditorRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false)
  const [description, setDescription] = useState(subtopic.description)
  const saveDescription = async () => {
    if (description.length <= 280 && !isSubmitting && await onDescription(description.trim())) setIsDescriptionEditing(false)
  }
  const [name, setName] = useState(subtopic.name)
  const save = async () => {
    if (name.trim() && !subtopic.locked && !isSubmitting && await onRename(name.trim())) setIsEditing(false)
  }
  return (
    <TableRow className="grid curriculum-mobile-grid md:curriculum-grid">
      <span role="cell" className="text-label-l text-primary col-start-1 row-start-1">{String(subtopic.order).padStart(2, '0')}</span>
      <div role="cell" className="flex min-w-0 flex-col gap-2 col-start-1 row-start-2 md:col-start-2 md:row-start-1">
        <div className={`flex min-w-0 items-center gap-2 ${isEditing ? 'flex-wrap' : ''}`}>
          {isEditing && !subtopic.locked ? (
            <>
              <TextField label={`Nombre de ${subtopic.name}`} hideLabel value={name} onChange={setName} disabled={isSubmitting} onSubmit={() => void save()} className="min-w-0 flex-1" />
              <Button size="sm" label="Guardar" disabled={isSubmitting || !name.trim()} onClick={() => void save()} />
              <Button size="sm" variant="neutral" label="Cancelar" disabled={isSubmitting} onClick={() => setIsEditing(false)} />
            </>
          ) : (
            <>
              <span className="min-w-0 break-words text-title text-content-primary">{subtopic.name}</span>
              {subtopic.locked ? (
                <span tabIndex={0} className="inline-flex shrink-0 text-content-secondary" title="Tiene material: archívalo en lugar de eliminarlo">
                  <Icon name="lock" label="Tiene material: archívalo en lugar de eliminarlo" />
                </span>
               ) : null}
            </>
          )}
        </div>
        {isDescriptionEditing ? <div className="flex min-w-0 flex-wrap items-end gap-2">
          <TextField compact label={`Descripción de ${subtopic.name} (opcional)`} value={description} onChange={setDescription} maxLength={280}
            disabled={isSubmitting} onSubmit={() => void saveDescription()} className="min-w-0 flex-1" />
          <Button size="sm" label="Guardar descripción" disabled={isSubmitting} onClick={() => void saveDescription()} />
          <Button size="sm" variant="neutral" label="Cancelar" disabled={isSubmitting} onClick={() => setIsDescriptionEditing(false)} />
        </div> : subtopic.description ? <span className="text-body-m text-content-secondary">{subtopic.description}</span> : null}
      </div>
      <div role="cell" className="flex min-w-0 flex-col gap-2 col-start-1 row-start-3 md:col-start-3 md:row-start-1">
        <MaterialStatusChip status={subtopic.materialStatus} />
      </div>
      <span role="cell" className="text-body-l col-start-1 row-start-4 md:col-start-4 md:row-start-1">{subtopic.approvedExerciseCount}</span>
      <div role="cell" className="flex min-w-0 items-center gap-2.5 col-start-1 row-start-5 md:col-start-5 md:row-start-1">
        <ProgressBar value={subtopic.averageMastery} tone={masteryTone(subtopic.averageMastery)} label={`Dominio promedio en ${subtopic.name}`} />
        <span className="shrink-0 text-body-m-bold text-content-secondary">{subtopic.averageMastery === null ? 'Sin datos' : `${Math.round(subtopic.averageMastery)}%`}</span>
      </div>
      <div role="cell" className="w-actions col-start-2 row-start-1 row-span-5 justify-self-end md:col-start-6 md:row-span-1">
        <ActionMenu label={`Acciones de ${subtopic.name}`} disabled={isSubmitting} items={[
          { id: 'rename', label: 'Renombrar', icon: 'edit', disabled: subtopic.locked,
            disabledReason: 'Tiene material: archívalo en lugar de eliminarlo',
            onSelect: () => { setName(subtopic.name); setIsDescriptionEditing(false); setIsEditing(true) } },
          { id: 'description', label: subtopic.description ? 'Editar descripción' : 'Agregar descripción', icon: 'edit',
            onSelect: () => { setDescription(subtopic.description); setIsEditing(false); setIsDescriptionEditing(true) } },
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
