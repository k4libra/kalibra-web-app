/**
 * Collects course metadata and new subtopics with optional descriptions.
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
  /** Saves editable course metadata. */
  onSave: (input: UpdateCourseInput) => Promise<boolean>
  /** Appends a subtopic and reports success. */
  onAdd: (name: string, description?: string) => Promise<boolean>
}

/** Edits course metadata and emits new subtopics without making requests. */
export function CourseDetailsForm({ course, isSubmitting, onSave, onAdd }: CourseDetailsFormProps) {
  const [name, setName] = useState(course.name)
  const [code, setCode] = useState(course.code)
  const [term, setTerm] = useState(course.term)
  const [faculty, setFaculty] = useState(course.faculty ?? '')
  const [semester, setSemester] = useState(course.semester ?? '')
  const [description, setDescription] = useState('')
  const [subtopic, setSubtopic] = useState('')
  const canSave = Boolean(name.trim() && code.trim() && (name.trim() !== course.name || code.trim() !== course.code || term.trim() !== course.term || faculty.trim() !== (course.faculty ?? '') || semester.trim() !== (course.semester ?? '')) && !isSubmitting)
  const add = async () => {
    if (subtopic.trim() && description.length <= 280 && !isSubmitting && await onAdd(subtopic.trim(), description.trim() || undefined)) { setSubtopic(''); setDescription('') }
  }
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="Nombre del curso" value={name} onChange={setName} disabled={isSubmitting} />
          <TextField label="Código" value={code} onChange={setCode} disabled={isSubmitting} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="Ciclo" value={term} onChange={setTerm} disabled={isSubmitting} />
          <TextField label="Facultad" value={faculty} onChange={setFaculty} disabled={isSubmitting} />
          <TextField label="Semestre (opcional)" value={semester} onChange={setSemester} disabled={isSubmitting} />
        </div>
        <Button label="Guardar curso" icon="check" variant="tonal" disabled={!canSave}
          onClick={() => { if (canSave) void onSave({ name: name.trim(), code: code.trim(), term: term.trim() || null, faculty: faculty.trim() || null, semester: semester.trim() || null }) }} />
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          <TextField label="Nuevo subtema" value={subtopic} onChange={setSubtopic} onSubmit={() => void add()} disabled={isSubmitting} className="w-full min-w-0 md:flex-1" />
          <TextField label="Descripción del nuevo subtema (opcional)" value={description} onChange={setDescription} maxLength={280} disabled={isSubmitting} className="w-full min-w-0 md:flex-1" />
          <Button label="Agregar subtema" icon="add" variant="tonal" disabled={!subtopic.trim() || isSubmitting} onClick={() => void add()} className="w-full md:w-auto" />
        </div>
      </div>
    </Card>
  )
}
