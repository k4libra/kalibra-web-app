/**
 * Dialog to create a course with its subtopics.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { Button, Callout, Chip, Modal, TextField } from '@/components/ui'
import type { CreateCourseInput } from '@/types/course'
import { plural } from '@/utils/plural'

/**
 * Props accepted by {@link CreateCourseModal}.
 */
export interface CreateCourseModalProps {
  /** Error returned by course creation. */
  error?: string | null
  /** Whether a creation request is in flight. */
  isSubmitting: boolean
  /** Called when the teacher cancels or closes the dialog. */
  onClose: () => void
  /** Called with the data of the course when the teacher confirms. */
  onSubmit: (input: CreateCourseInput) => void
}

/**
 * Collects the name, code and subtopics of a new course and emits them on confirm.
 *
 * @remarks
 * The create button stays disabled until every field is filled and at least one subtopic is added.
 * Mount it only while open so each opening starts empty.
 */
export function CreateCourseModal({ isSubmitting, error, onClose, onSubmit }: CreateCourseModalProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [draftSubtopic, setDraftSubtopic] = useState('')
  const [subtopics, setSubtopics] = useState<string[]>([])

  const canAddSubtopic = draftSubtopic.trim().length > 0
  const canCreate = name.trim() && code.trim() && subtopics.length > 0 && !isSubmitting

  const handleAddSubtopic = () => {
    if (!canAddSubtopic) return
    setSubtopics((current) => [...current, draftSubtopic.trim()])
    setDraftSubtopic('')
  }

  const handleSubmit = () => {
    if (canCreate) onSubmit({ name: name.trim(), code: code.trim(), subtopics })
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      icon="school"
      title="Crear curso"
      description="Define el nombre del curso y al menos un subtema sobre el que cargarás material."
      actions={
        <>
          <Button label="Cancelar" variant="neutral" onClick={onClose} />
          <Button label="Crear curso" icon="check" disabled={!canCreate} onClick={handleSubmit} />
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {error && <Callout icon="error" tone="danger">{error}</Callout>}
        <TextField label="Nombre del curso" icon="school" placeholder="Ej. Álgebra Lineal" value={name} onChange={setName} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="Código" icon="tag" placeholder="Ej. MA-201" value={code} onChange={setCode} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-body-m-bold text-content-primary">Subtemas del curso</span>
            <Chip label={plural(subtopics.length, 'subtema', 'subtemas')} tone={subtopics.length > 0 ? 'primary' : 'neutral'} />
          </div>
          <div className="flex items-end gap-2">
            <TextField
              label="Nuevo subtema"
              hideLabel
              icon="add_circle"
              placeholder={subtopics.length > 0 ? 'Escribe otro subtema' : 'Ej. Espacios Vectoriales'}
              value={draftSubtopic}
              onChange={setDraftSubtopic}
              onSubmit={handleAddSubtopic}
              className="flex-1"
            />
            <Button label="Agregar" variant="tonal" icon="add" disabled={!canAddSubtopic} onClick={handleAddSubtopic} />
          </div>
          {subtopics.length > 0 ? (
            <ol className="flex flex-col gap-1.5">
              {subtopics.map((subtopic, index) => (
                <li key={`${subtopic}-${index}`} className="flex items-center gap-3 rounded-md bg-primary-subtle px-3 py-2.5">
                  <span className="text-label-l text-primary">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-body-l text-content-primary">{subtopic}</span>
                </li>
              ))}
            </ol>
          ) : (
            <>
              <p className="rounded-md bg-primary-subtle px-4 py-4 text-center text-body-m text-content-secondary">Aún no agregas subtemas</p>
              <Callout icon="error" tone="danger" size="sm">
                Agrega al menos un subtema para poder crear el curso.
              </Callout>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
