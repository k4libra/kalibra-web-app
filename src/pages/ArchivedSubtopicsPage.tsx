/**
 * Provides the dedicated archive and curriculum restoration screen.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button, Callout, EmptyState, IconButton, LoadingState, MaterialStatusChip, Modal, PageHeader, ProgressBar, TableCard, TableHeader, TableRow, UnarchiveIcon } from '@/components/ui'
import { useCourseSubtopics } from '@/hooks/useCourseSubtopics'
import { courseRoutes } from '@/navigation/routes'
import { masteryTone } from '@/utils/mastery'
import { formatMastery } from '@/utils/monitoring'
import type { Subtopic } from '@/types/course'

/** Shows archived curriculum rows and confirmation using {@link useCourseSubtopics} for restoration. */
export function ArchivedSubtopicsPage() {
  const { courseId = '' } = useParams()
  const page = useCourseSubtopics(courseId, true)
  const { course, archivedSubtopics, isLoading, error, mutationError, isSubmitting } = page
  const [confirmation, setConfirmation] = useState<{ courseId: string; subtopic: Subtopic } | null>(null)
  const pending = confirmation?.courseId === courseId ? confirmation.subtopic : null
  const close = () => { if (!isSubmitting) setConfirmation(null) }
  const confirm = async () => {
    if (!pending || isSubmitting || isLoading) return
    if (await page.updateSubtopic(pending.id, { status: 'ACTIVE' })) setConfirmation(null)
  }
  return <>
    <PageHeader eyebrow={<><Link to={courseRoutes.subtopics(courseId)} className="text-primary">Subtemas</Link> › Archivados</>} title="Subtemas archivados"
      description="Desarchiva un subtema para volver a cargar material y practicar. Su historial se conserva." />
    {error && <Callout icon="error" tone="danger">{error}</Callout>}
    {mutationError && !pending && <Callout icon="error" tone="danger">{mutationError}</Callout>}
    {isLoading ? <LoadingState /> : course && (archivedSubtopics.length ?
      <TableCard label="Subtemas archivados">
        <TableHeader columns={['#', 'Subtema', 'Material curricular', 'Ejercicios aprobados', 'Dominio promedio', 'Acciones']} className="md:curriculum-grid" />
        {archivedSubtopics.map((subtopic) => <TableRow key={subtopic.id} className="grid curriculum-mobile-grid md:curriculum-grid">
          <span role="cell" className="text-label-l text-primary">{String(subtopic.order).padStart(2, '0')}</span>
          <div role="cell" className="min-w-0"><p className="break-words text-title">{subtopic.name}</p><p className="text-body-m text-content-secondary">{subtopic.solvedExerciseCount === null ? subtopic.description || 'Sin ejercicios resueltos registrados' : `${subtopic.solvedExerciseCount} ejercicios resueltos`}</p></div>
          <div role="cell"><MaterialStatusChip status={subtopic.materialStatus} /></div>
          <span role="cell" className="text-body-l">{subtopic.approvedExerciseCount}</span>
          <div role="cell" className="flex min-w-0 items-center gap-2.5"><ProgressBar value={subtopic.averageMastery} tone={masteryTone(subtopic.averageMastery)} label={`Dominio promedio en ${subtopic.name}`} /><span className="shrink-0 text-body-m-bold">{subtopic.averageMastery === null ? 'Sin datos' : formatMastery(subtopic.averageMastery)}</span></div>
          <div role="cell" className="w-actions justify-self-end">
            <IconButton icon={UnarchiveIcon} label={`Desarchivar ${subtopic.name}`} disabled={isSubmitting || isLoading}
              onClick={() => setConfirmation({ courseId, subtopic })} />
          </div>
        </TableRow>)}
      </TableCard> : <EmptyState icon="account_tree" title="No hay subtemas archivados" description="Los subtemas que archives aparecerán aquí." />)}
    {pending && <Modal isOpen title="Desarchivar subtema" size="confirm" onClose={close}
      description={`«${pending.name}» volverá a estar disponible para cargar material y practicar.`}
      actions={<>
        <Button label="Cancelar" variant="neutral" disabled={isSubmitting} onClick={close} />
        <Button label="Desarchivar subtema" disabled={isSubmitting || isLoading} onClick={() => void confirm()} />
      </>}>
      {mutationError && <Callout icon="error" tone="danger">{mutationError}</Callout>}
    </Modal>}
  </>
}
