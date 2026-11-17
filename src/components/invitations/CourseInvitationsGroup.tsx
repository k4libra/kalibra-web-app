/**
 * Invitations of one course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, CourseGroup, IconBox, TableCard, TableHeader, TableRow } from '@/components/ui'
import type { CourseOverview } from '@/types/course'
import type { Invitation } from '@/types/invitation'
import { cn } from '@/utils/cn'
import { plural } from '@/utils/plural'
import { InvitationStatusChip } from './InvitationStatusChip'

// Grid of the table from `md`: invited student, state, validity and action.
const GRID = 'md:grid-cols-12'
const CELLS = ['md:col-span-5', 'md:col-span-2', 'md:col-span-3', 'md:col-span-2']

/**
 * Props accepted by {@link CourseInvitationsGroup}.
 */
export interface CourseInvitationsGroupProps {
  /** Course of the group. */
  course: CourseOverview
  /** Invitations sent to the course. */
  invitations: Invitation[]
  /** Called with the invitation the teacher wants to cancel. */
  onCancel: (invitation: Invitation) => void
  /** Called with the invitation the teacher wants to send again. */
  onResend: (invitation: Invitation) => void
  /** Opens invitation with this course preselected. */
  onInvite?: (courseId: string) => void
  /** Blocks repeated mutations until completion. */
  isSubmitting?: boolean
}

/**
 * Lists the invitations of a course with their state and emits cancel and resend actions.
 */
export function CourseInvitationsGroup({ course, invitations, onCancel, onResend, onInvite, isSubmitting = false }: CourseInvitationsGroupProps) {
  return (
    <CourseGroup course={course} countIcon="send" countLabel={plural(invitations.length, 'invitación', 'invitaciones')}
      emptyMessage={!invitations.length ? 'Aún no has invitado estudiantes a este curso.' : undefined}
      action={!invitations.length && onInvite ? <Button label={`Invitar a ${course.name}`} icon="person_add" variant="tonal" size="sm" onClick={() => onInvite(course.id)} /> : undefined}>
      {invitations.length > 0 && (
        <TableCard label={`Invitaciones de ${course.name}`}>
          <TableHeader columns={['Estudiante invitado', 'Estado', 'Vigencia', 'Acción']} cellClassNames={CELLS} className={GRID} />
          {invitations.map((invitation) => (
            <TableRow key={invitation.id} className={GRID}>
              <span role="cell" className={cn('flex items-center gap-2.5', CELLS[0])}>
                <IconBox icon="mail" tone={invitation.status === 'expired' || invitation.status === 'cancelled' ? 'neutral' : 'primary'} size="sm" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-label-l text-content-primary">{invitation.email}</span>
                  <span className="text-body-m text-content-secondary">Enviada el {invitation.sentAt}</span>
                </span>
              </span>
              <span role="cell" className={CELLS[1]}>
                <InvitationStatusChip status={invitation.status} />
              </span>
              <span role="cell" className={cn('text-body-m text-content-secondary', CELLS[2])}>
                {invitation.validity}
              </span>
              <span role="cell" className={CELLS[3]}>
                {invitation.status === 'pending' && (
                  <Button label="Cancelar" icon="close" disabled={isSubmitting} variant="danger" size="sm" onClick={() => onCancel(invitation)} />
                )}
                {(invitation.status === 'expired' || invitation.status === 'cancelled') && (
                  <Button label="Reenviar" icon="send" disabled={isSubmitting} variant="tonal" size="sm" onClick={() => onResend(invitation)} />
                )}
                {invitation.status === 'accepted' && <span className="text-label-l text-content-muted">—</span>}
              </span>
            </TableRow>
          ))}
        </TableCard>
      )}
    </CourseGroup>
  )
}
