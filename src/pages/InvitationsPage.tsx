/**
 * Invitations page of the teacher panel.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { CancelInvitationDialog, CourseInvitationsGroup, InviteStudentModal } from '@/components/invitations'
import { Button, Callout, EmptyState, LoadingState, PageHeader, StatCard } from '@/components/ui'
import { useInvitationsPage } from '@/hooks/useInvitationsPage'

/**
 * Shows the invitations of every course with the invite, cancel and resend actions, using {@link useInvitationsPage}.
 */
export function InvitationsPage() {
  const page = useInvitationsPage()
  const hasCourses = page.groups.length > 0
  const cancelCourse = page.groups.find((group) => group.course.id === page.toCancel?.courseId)?.course

  return (
    <>
      <PageHeader
        eyebrow="PANEL DOCENTE"
        title="Invitaciones"
        description="Invitaciones enviadas a tus estudiantes, agrupadas por curso. Solo llegan a correos con cuenta registrada en Kalibra."
        actions={hasCourses && <Button label="Invitar estudiante" icon="person_add" onClick={page.openInvite} />}
      />

      {page.error && (
        <Callout icon="error" tone="danger">
          {page.error}
        </Callout>
      )}

      {page.isLoading ? (
        <LoadingState />
      ) : hasCourses ? (
        <>
          <section aria-label="Resumen" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon="schedule" tone="warning" value={String(page.pendingCount)} label={page.pendingCount === 1 ? 'Pendiente' : 'Pendientes'} />
            <StatCard icon="how_to_reg" tone="success" value={String(page.acceptedCount)} label={page.acceptedCount === 1 ? 'Aceptada' : 'Aceptadas'} />
            <StatCard icon="event_busy" tone="danger" value={String(page.closedCount)} label="Vencidas o canceladas" />
          </section>
          {page.groups.map((group) => (
            <CourseInvitationsGroup
              key={group.course.id}
              course={group.course}
              invitations={group.invitations}
              onCancel={page.askCancel}
              onResend={page.resend}
            />
          ))}
          <Callout icon="timer">
            Las invitaciones sin respuesta vencen automáticamente a los 3 días. Puedes reenviarlas con una nueva vigencia.
          </Callout>
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
    </>
  )
}
