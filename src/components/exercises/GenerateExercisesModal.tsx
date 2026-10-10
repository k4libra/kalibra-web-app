/**
 * Dialog to request new generated exercises.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { Button, Callout, Chip, MaterialStatusChip, Modal, Select } from '@/components/ui'
import type { CourseOverview, MaterialStatus, Subtopic } from '@/types/course'
import { cn } from '@/utils/cn'
import { plural } from '@/utils/plural'

/**
 * Number of exercises requested per generation, as defined by the product.
 */
export const EXERCISES_PER_GENERATION = 10

// Description of a subtopic option for each material state.
const STATUS_DESCRIPTION: Record<Exclude<MaterialStatus, 'ready'>, string> = {
  processing: 'El material aún está en ingestión',
  error: 'El material tiene un error de ingestión',
  missing: 'Aún no se ha cargado material',
}

/**
 * Course that can be chosen in the dialog, with its subtopics.
 */
export interface GenerationCourse {
  /** Course data. */
  course: CourseOverview
  /** Subtopics of the course. */
  subtopics: Subtopic[]
}

/**
 * Props accepted by {@link GenerateExercisesModal}.
 */
export interface GenerateExercisesModalProps {
  /** Error returned by the generation request. */
  error?: string | null
  /** Courses of the teacher; courses without ready material are disabled. */
  courses: GenerationCourse[]
  /** Whether a generation request is in flight. */
  isSubmitting: boolean
  /** Called when the teacher cancels or closes the dialog. */
  onClose: () => void
  /** Called with the chosen course and subtopic when the teacher confirms. */
  onGenerate: (courseId: string, subtopicId: string) => void
  /** Called with a course id when the teacher wants to upload the missing material. */
  onUploadMaterial: (courseId: string) => void
}

/**
 * Lets the teacher pick a course and a subtopic with ready material and emits the generation request.
 *
 * @remarks
 * Mount it only while open so each opening starts from the first course with ready material.
 */
export function GenerateExercisesModal({ courses, isSubmitting, error, onClose, onGenerate, onUploadMaterial }: GenerateExercisesModalProps) {
  const readyCount = (item: GenerationCourse) => item.subtopics.filter((subtopic) => subtopic.materialStatus === 'ready').length
  const initialCourse = courses.find((item) => readyCount(item) > 0) ?? courses[0]
  const [courseId, setCourseId] = useState(initialCourse?.course.id ?? '')
  const selected = courses.find((item) => item.course.id === courseId)
  const subtopics = selected?.subtopics ?? []
  const [subtopicId, setSubtopicId] = useState(subtopics.find((subtopic) => subtopic.materialStatus === 'ready')?.id ?? '')
  const notReady = subtopics.filter((subtopic) => subtopic.materialStatus !== 'ready')

  const handleCourseChange = (nextCourseId: string) => {
    setCourseId(nextCourseId)
    const next = courses.find((item) => item.course.id === nextCourseId)
    setSubtopicId(next?.subtopics.find((subtopic) => subtopic.materialStatus === 'ready')?.id ?? '')
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="xl"
      icon="auto_awesome"
      title="Generar ejercicios"
      description={`Kalibra generará ${EXERCISES_PER_GENERATION} ejercicios anclados al material del subtema y los verificará antes de publicarlos.`}
      actions={
        <>
          <Button label="Cancelar" variant="neutral" onClick={onClose} />
          <Button
            label={`Generar ${EXERCISES_PER_GENERATION} ejercicios`}
            icon="auto_awesome"
            disabled={!subtopicId || isSubmitting}
            onClick={() => onGenerate(courseId, subtopicId)}
          />
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {error && <Callout icon="error" tone="danger">{error}</Callout>}
        <Select
          label="Curso"
          icon="school"
          value={courseId}
          onChange={handleCourseChange}
          options={courses.map((item) => {
            const ready = readyCount(item)
            return {
              value: item.course.id,
              label: item.course.name,
              description: ready > 0 ? `${item.course.code} · ${plural(ready, 'subtema con material listo', 'subtemas con material listo')}` : `${item.course.code} · sin material listo`,
              disabled: ready === 0,
              trailing: ready === 0 ? <Chip label="Sin material" tone="neutral" icon="draft" /> : undefined,
            }
          })}
        />
        <fieldset className="flex flex-col gap-2">
          <legend className="pb-1.5 text-body-m-bold text-content-primary">Subtema</legend>
          {subtopics.map((subtopic) => {
            const isReady = subtopic.materialStatus === 'ready'
            const isSelected = subtopic.id === subtopicId
            return (
              <label
                key={subtopic.id}
                className={cn(
                  'flex items-center gap-3 rounded-md border p-3',
                  isSelected ? 'border-primary bg-primary-subtle' : 'border-line-default bg-surface-card',
                  isReady ? 'cursor-pointer' : 'cursor-not-allowed opacity-70',
                )}
              >
                <input
                  type="radio"
                  name="subtopic"
                  value={subtopic.id}
                  checked={isSelected}
                  disabled={!isReady}
                  onChange={() => setSubtopicId(subtopic.id)}
                  className="size-5 accent-primary-strong"
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-label-l text-content-primary">{subtopic.name}</span>
                  <span className="text-body-m text-content-secondary">
                    {isReady
                      ? `Material listo · ${plural(subtopic.approvedExerciseCount, 'ejercicio aprobado', 'ejercicios aprobados')}`
                      : STATUS_DESCRIPTION[subtopic.materialStatus as Exclude<MaterialStatus, 'ready'>]}
                  </span>
                </span>
                <MaterialStatusChip status={subtopic.materialStatus} />
              </label>
            )
          })}
        </fieldset>
        {notReady.length > 0 && (
          <Callout
            icon="info"
            tone="warning"
            size="sm"
            action={<Button label="Cargar material" variant="tonal" size="sm" onClick={() => onUploadMaterial(courseId)} />}
          >
            {notReady.map((subtopic) => subtopic.name).join(' y ')} {notReady.length === 1 ? 'no tiene' : 'no tienen'} material listo. Primero debes
            cargar o reemplazar su material.
          </Callout>
        )}
      </div>
    </Modal>
  )
}
