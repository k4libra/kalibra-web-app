/**
 * Collects changes to course metadata and new subtopic names.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { Button, Card, TextField } from '@/components/ui'
import type { CourseOverview, UpdateCourseInput } from '@/types/course'

/** Props accepted by {@link CourseDetailsForm}. */
export interface CourseDetailsFormProps {
  /** Persisted course metadata. */
  course: CourseOverview
  /** Blocks editing while a mutation is pending. */
  isSubmitting: boolean
  /** Saves course name and code. */
  onSave: (input: UpdateCourseInput) => Promise<boolean>
  /** Appends a subtopic and reports success. */
  onAdd: (name: string) => Promise<boolean>
}

/** Edits course metadata and emits new subtopics without making requests. */
export function CourseDetailsForm({ course, isSubmitting, onSave, onAdd }: CourseDetailsFormProps) {
  const [name, setName] = useState(course.name)
  const [code, setCode] = useState(course.code)
  const [subtopic, setSubtopic] = useState('')
  const canSave = Boolean(name.trim() && code.trim() && (name.trim() !== course.name || code.trim() !== course.code) && !isSubmitting)
  const add = async () => {
    if (subtopic.trim() && !isSubmitting && await onAdd(subtopic.trim())) setSubtopic('')
  }
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="Nombre del curso" value={name} onChange={setName} disabled={isSubmitting} />
          <TextField label="Código" value={code} onChange={setCode} disabled={isSubmitting} />
        </div>
        <Button label="Guardar curso" icon="check" variant="tonal" disabled={!canSave}
          onClick={() => { if (canSave) void onSave({ name: name.trim(), code: code.trim() }) }} />
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          <TextField label="Nuevo subtema" value={subtopic} onChange={setSubtopic} onSubmit={() => void add()} disabled={isSubmitting} className="w-full min-w-0 md:flex-1" />
          <Button label="Agregar subtema" icon="add" variant="tonal" disabled={!subtopic.trim() || isSubmitting} onClick={() => void add()} className="w-full md:w-auto" />
        </div>
      </div>
    </Card>
  )
}
