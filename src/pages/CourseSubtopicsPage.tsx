/**
 * Subtopics page of a course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { CourseDetailsForm, SubtopicsTable } from '@/components/courses'
import { Button, Callout, EmptyState, LoadingState, Modal, PageHeader, StatCard } from '@/components/ui'
import { useCourseSubtopics } from '@/hooks/useCourseSubtopics'
import { courseRoutes } from '@/navigation/routes'
import type { Subtopic } from '@/types/course'

/** Shows and edits the curriculum using {@link useCourseSubtopics} for data and actions. */
export function CourseSubtopicsPage() {
  const { courseId = '' } = useParams()
  const navigate = useNavigate()
  const [isCourseEditorOpen, setIsCourseEditorOpen] = useState(false)
  const page = useCourseSubtopics(courseId)
  const { course, subtopics, activeSubtopics, archivedSubtopics, isLoading, error, mutationError, isSubmitting } = page
  const [confirmation, setConfirmation] = useState<{ courseId: string; subtopic: Subtopic; action: 'delete' | 'status' } | null>(null)
  const pending = confirmation?.courseId === courseId ? confirmation : null
  const readyCount = activeSubtopics.filter((subtopic) => subtopic.materialStatus === 'ready').length
  const approvedCount = activeSubtopics.reduce((total, subtopic) => total + subtopic.approvedExerciseCount, 0)
  const closeConfirmation = () => { if (!isSubmitting) setConfirmation(null) }
  const confirm = async () => {
    if (!pending || isSubmitting || isLoading) return
    const succeeded = pending.action === 'delete'
      ? await page.deleteSubtopic(pending.subtopic.id)
      : await page.updateSubtopic(pending.subtopic.id, { status: 'ARCHIVED' })
    if (succeeded) setConfirmation(null)
  }
  const confirmationLabel = pending?.action === 'delete' ? 'Eliminar subtema' : 'Archivar subtema'

  return (
    <>
      <PageHeader eyebrow={`MIS CURSOS  ›  ${course?.name ?? ''}`} title="Subtemas del curso"
        description="Cada subtema agrupa el material curricular sobre el que Kalibra genera y verifica ejercicios."
        actions={<Button label="Cargar material" icon="upload_file" onClick={() => navigate(courseRoutes.material(courseId))} />} />
      {error && <Callout icon="error" tone="danger">{error}</Callout>}
      {mutationError && !pending && <Callout icon="error" tone="danger">{mutationError}</Callout>}
      {isLoading ? <LoadingState /> : course && (
        <>
          <section aria-label="Resumen" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon="account_tree" value={String(activeSubtopics.length)} label="Subtemas definidos" />
            <StatCard icon="task_alt" tone="success" value={String(readyCount)} label="Con material listo" />
            <StatCard icon="quiz" tone="warning" value={String(approvedCount)} label="Ejercicios aprobados" />
          </section>
          {activeSubtopics.length ? <SubtopicsTable subtopics={activeSubtopics} total={subtopics.length} isSubmitting={isSubmitting}
            onUpdate={page.updateSubtopic} onStatus={(subtopic) => setConfirmation({ courseId, subtopic, action: 'status' })}
            onDelete={(subtopic) => setConfirmation({ courseId, subtopic, action: 'delete' })} />
            : <EmptyState icon="account_tree" title="No hay subtemas activos" description="Agrega un subtema para empezar." />}
          <div className="flex items-center justify-between">
          {archivedSubtopics.length > 0 && <Link to={courseRoutes.archivedSubtopics(courseId)}
            className="self-start rounded-sm text-label-l text-primary underline">Ver archivados ({archivedSubtopics.length})</Link>}
            <Button label="Editar curso" icon="edit" size="sm" variant="ghost" onClick={() => setIsCourseEditorOpen(true)} />
          </div>
          <Callout icon="lightbulb">Solo los subtemas activos con material en estado Listo pueden generar ejercicios.</Callout>
        </>
      )}
      {isCourseEditorOpen && course && <Modal isOpen title="Editar curso" icon="edit" onClose={() => setIsCourseEditorOpen(false)}>
        <CourseDetailsForm key={`${course.id}:${course.name}:${course.code}:${course.term}:${course.faculty}:${course.semester}`} course={course} isSubmitting={isSubmitting} onSave={page.updateCourse} onAdd={page.addSubtopic} />
        {mutationError && <Callout icon="error" tone="danger">{mutationError}</Callout>}
      </Modal>}
      {pending && <Modal isOpen title={confirmationLabel} icon="account_tree" size="confirm" onClose={closeConfirmation}
        description={pending.action === 'delete' ? `Se eliminará «${pending.subtopic.name}».`
          : `«${pending.subtopic.name}» dejará de estar disponible para cargar material y practicar.`}
        actions={<>
          <Button label="Cancelar" variant="neutral" disabled={isSubmitting} onClick={closeConfirmation} />
          <Button label={confirmationLabel} variant={pending.action === 'delete' ? 'danger' : 'primary'} disabled={isSubmitting || isLoading} onClick={() => void confirm()} />
        </>}>
        {mutationError && <Callout icon="error" tone="danger">{mutationError}</Callout>}
      </Modal>}
    </>
  )
}
