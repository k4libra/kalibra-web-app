/**
 * Provides the dedicated archive and curriculum restoration screen.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button, Callout, EmptyState, IconButton, LoadingState, MaterialStatusChip, Modal, PageHeader, TableCard, TableHeader, TableRow, UnarchiveIcon } from '@/components/ui'
import { useCourseSubtopics } from '@/hooks/useCourseSubtopics'
import { courseRoutes } from '@/navigation/routes'
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
    <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-2 text-body-m text-content-secondary">
      <Link to={courseRoutes.subtopics(courseId)} className="rounded-sm text-primary underline">Subtemas</Link>
      <span aria-hidden="true">›</span><span aria-current="page">Archivados</span>
    </nav>
    <PageHeader eyebrow={course?.name ?? ''} title="Subtemas archivados"
      description="Desarchiva un subtema para volver a cargar material y practicar. Su historial se conserva." />
    {error && <Callout icon="error" tone="danger">{error}</Callout>}
    {mutationError && !pending && <Callout icon="error" tone="danger">{mutationError}</Callout>}
    {isLoading ? <LoadingState /> : course && (archivedSubtopics.length ?
      <TableCard label="Subtemas archivados">
        <TableHeader columns={['Subtema', 'Material', 'Ejercicios resueltos', 'Acción']} className="md:archived-curriculum-grid" />
        {archivedSubtopics.map((subtopic) => <TableRow key={subtopic.id} className="grid curriculum-mobile-grid md:archived-curriculum-grid">
          <span role="cell" className="min-w-0 break-words text-title col-start-1 row-start-1">{subtopic.name}</span>
          <div role="cell" className="min-w-0 col-start-1 row-start-2 md:col-start-2 md:row-start-1"><MaterialStatusChip status={subtopic.materialStatus} /></div>
          <span role="cell" className="text-body-m text-content-secondary col-start-1 row-start-3 md:col-start-3 md:row-start-1">{subtopic.solvedExerciseCount == null ? 'Sin datos de ejercicios resueltos' : `${subtopic.solvedExerciseCount} ejercicios resueltos`}</span>
          <div role="cell" className="w-actions col-start-2 row-start-1 row-span-3 justify-self-end md:col-start-4 md:row-span-1">
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
