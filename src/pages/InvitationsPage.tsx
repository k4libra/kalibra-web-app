/**
 * Invitations page of the teacher panel.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { CancelInvitationDialog, CourseInvitationsGroup, InviteStudentModal } from '@/components/invitations'
import { useState } from 'react'
import { InlineToast } from '@/context/ToastContext'
import { CourseFilter, StatStrip, StatItem, Button, Callout, EmptyState, LoadingState, PageHeader } from '@/components/ui'
import { useInvitationsPage } from '@/hooks/useInvitationsPage'

/**
 * Shows the invitations of every course with the invite, cancel and resend actions, using {@link useInvitationsPage}.
 */
export function InvitationsPage() {
  const page = useInvitationsPage()
  const [courseFilter, setCourseFilter] = useState('')
  const visibleGroups = page.groups.filter((group) => !courseFilter || group.course.id === courseFilter)
  const hasCourses = page.groups.length > 0
  const cancelCourse = page.groups.find((group) => group.course.id === page.toCancel?.courseId)?.course

  return (
    <div className="-mt-1 flex flex-col gap-4">
      <PageHeader
        eyebrow="PANEL DOCENTE"
        title="Invitaciones"
        description="Invitaciones enviadas a tus estudiantes, agrupadas por curso. Solo llegan a correos con cuenta registrada en Kalibra."
        helperIcon="clock"
        helper="Las invitaciones sin respuesta vencen a los 3 días; puedes reenviarlas con una nueva vigencia."
        actions={hasCourses && <Button label="Invitar estudiante" icon="person_add" onClick={page.openInvite} />}
      />

      <InlineToast />
      {page.error && (
        <Callout icon="error" tone="danger">
          {page.error}
        </Callout>
      )}

      {page.isLoading ? (
        <LoadingState />
      ) : hasCourses ? (
        <>
          <StatStrip>
            <StatItem icon="schedule" tone="warning" value={String(page.pendingCount)} label={page.pendingCount === 1 ? 'Pendiente' : 'Pendientes'} />
            <StatItem icon="how_to_reg" tone="success" value={String(page.acceptedCount)} label={page.acceptedCount === 1 ? 'Aceptada' : 'Aceptadas'} />
            <StatItem icon="event_busy" tone="danger" value={String(page.closedCount)} label="Vencidas o canceladas" />
          </StatStrip>
          <CourseFilter value={courseFilter} onChange={setCourseFilter} courses={page.groups.map((group) => ({ id: group.course.id, name: group.course.name, count: group.invitations.length }))} />
          {visibleGroups.map((group) => (
            <CourseInvitationsGroup
              key={group.course.id}
              course={group.course}
              invitations={group.invitations}
              onCancel={page.askCancel}
              onResend={page.resend}
              onInvite={page.openInvite}
              isSubmitting={page.isSubmitting}
            />
          ))}

        </>
      ) : (
        <EmptyState
          icon="forward_to_inbox"
          title="Aún no has enviado invitaciones"
          description="Necesitas un curso para invitar estudiantes. Cada invitación vence a los 3 días y solo llega a correos con cuenta en Kalibra."
          action={<Button label="Crear mi primer curso" icon="add" onClick={page.goToCourses} />}
        />
      )}

      {page.isInviteOpen && (
        <InviteStudentModal
          initialCourseId={page.initialCourseId}
          error={page.error}
          courses={page.groups.map((group) => group.course)}
          rejectedEmail={page.rejectedEmail}
          isSubmitting={page.isSubmitting}
          onClose={page.closeInvite}
          onSend={page.send}
        />
      )}
      <CancelInvitationDialog
        email={page.toCancel?.email ?? null}
        courseName={cancelCourse?.name ?? ''}
        isSubmitting={page.isSubmitting}
        onClose={page.closeCancel}
        onConfirm={page.confirmCancel}
      />
    </div>
  )
}
