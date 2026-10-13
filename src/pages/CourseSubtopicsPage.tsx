/**
 * Subtopics page of a course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { CourseDetailsForm, SubtopicsTable } from '@/components/courses'
import { Button, Callout, EmptyState, LoadingState, Modal, PageHeader, StatCard } from '@/components/ui'
import { useCourseSubtopics } from '@/hooks/useCourseSubtopics'
import { courseRoutes } from '@/navigation/routes'
import type { Subtopic } from '@/types/course'

/** Shows and edits the curriculum using {@link useCourseSubtopics} for data and actions. */
export function CourseSubtopicsPage() {
  const { courseId = '' } = useParams()
  const navigate = useNavigate()
  const page = useCourseSubtopics(courseId)
  const { course, subtopics, visibleSubtopics, isLoading, error, mutationError, isSubmitting } = page
  const [confirmation, setConfirmation] = useState<{ courseId: string; subtopic: Subtopic; action: 'delete' | 'status' } | null>(null)
  const pending = confirmation?.courseId === courseId ? confirmation : null
  const activeSubtopics = subtopics.filter((subtopic) => subtopic.status === 'ACTIVE')
  const readyCount = activeSubtopics.filter((subtopic) => subtopic.materialStatus === 'ready').length
  const approvedCount = activeSubtopics.reduce((total, subtopic) => total + subtopic.approvedExerciseCount, 0)
  const closeConfirmation = () => { if (!isSubmitting) setConfirmation(null) }
  const confirm = async () => {
    if (!pending || isSubmitting || isLoading) return
    const succeeded = pending.action === 'delete'
      ? await page.deleteSubtopic(pending.subtopic.id)
      : await page.updateSubtopic(pending.subtopic.id, { status: pending.subtopic.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' })
    if (succeeded) setConfirmation(null)
  }
  const confirmationLabel = pending?.action === 'delete' ? 'Eliminar subtema' : pending?.subtopic.status === 'ACTIVE' ? 'Archivar subtema' : 'Restaurar subtema'

  return (
    <>
      <PageHeader eyebrow={`MIS CURSOS  ›  ${course?.name ?? ''}`} title="Subtemas del curso"
        description="Cada subtema agrupa el material curricular sobre el que Kalibra genera y verifica ejercicios."
        actions={<Button label="Cargar material" icon="upload_file" onClick={() => navigate(courseRoutes.material(courseId))} />} />
      {error && <Callout icon="error" tone="danger">{error}</Callout>}
      {mutationError && !pending && <Callout icon="error" tone="danger">{mutationError}</Callout>}
      {isLoading ? <LoadingState /> : course && (
        <>
          <CourseDetailsForm key={`${course.id}:${course.name}:${course.code}`} course={course} isSubmitting={isSubmitting} onSave={page.updateCourse} onAdd={page.addSubtopic} />
          <section aria-label="Resumen" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon="account_tree" value={String(activeSubtopics.length)} label="Subtemas activos" />
            <StatCard icon="task_alt" tone="success" value={String(readyCount)} label="Con material listo" />
            <StatCard icon="quiz" tone="warning" value={String(approvedCount)} label="Ejercicios aprobados" />
          </section>
          <Button label="Mostrar archivados" variant="tonal" isPressed={page.showArchived}
            icon={page.showArchived ? 'check' : 'visibility'} onClick={() => page.setShowArchived(!page.showArchived)} />
          {visibleSubtopics.length ? <SubtopicsTable subtopics={visibleSubtopics} total={subtopics.length} isSubmitting={isSubmitting}
            onUpdate={page.updateSubtopic} onStatus={(subtopic) => setConfirmation({ courseId, subtopic, action: 'status' })}
            onDelete={(subtopic) => setConfirmation({ courseId, subtopic, action: 'delete' })} />
            : <EmptyState icon="account_tree" title="No hay subtemas visibles" description="Agrega un subtema o muestra los archivados." />}
          <Callout icon="lightbulb">Solo los subtemas activos con material en estado Listo pueden generar ejercicios.</Callout>
        </>
      )}
      {pending && <Modal isOpen title={confirmationLabel} icon="account_tree" size="confirm" onClose={closeConfirmation}
        description={pending.action === 'delete' ? `Se eliminará «${pending.subtopic.name}».`
          : pending.subtopic.status === 'ACTIVE' ? `«${pending.subtopic.name}» dejará de estar disponible para cargar material y practicar.`
          : `«${pending.subtopic.name}» volverá a estar disponible para cargar material y practicar.`}
        actions={<>
          <Button label="Cancelar" variant="neutral" disabled={isSubmitting} onClick={closeConfirmation} />
          <Button label={confirmationLabel} variant={pending.action === 'delete' ? 'danger' : 'primary'} disabled={isSubmitting || isLoading} onClick={() => void confirm()} />
        </>}>
        {mutationError && <Callout icon="error" tone="danger">{mutationError}</Callout>}
      </Modal>}
    </>
  )
}
