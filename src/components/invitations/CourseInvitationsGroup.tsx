/**
 * Invitations of one course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, Chip, Icon, IconBox, SectionHeader, TableCard, TableHeader, TableRow } from '@/components/ui'
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
}

/**
 * Lists the invitations of a course with their state and emits cancel and resend actions.
 */
export function CourseInvitationsGroup({ course, invitations, onCancel, onResend }: CourseInvitationsGroupProps) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeader
        icon={course.icon}
        title={course.name}
        subtitle={`${course.code}${course.term ? ` · Ciclo ${course.term}` : ''}`}
        trailing={<Chip label={plural(invitations.length, 'invitación', 'invitaciones')} tone="neutral" />}
      />
      {invitations.length === 0 ? (
        <div className="flex items-start gap-3 rounded-lg bg-surface-card p-4 shadow-card sm:items-center">
          <Icon name="info" size="lg" className="text-content-secondary" />
          <p className="text-body-l text-content-secondary">
            Aún no has invitado estudiantes a este curso. Usa Invitar estudiante y elige {course.name}.
          </p>
        </div>
      ) : (
        <TableCard label={`Invitaciones de ${course.name}`}>
          <TableHeader columns={['Estudiante invitado', 'Estado', 'Vigencia', 'Acción']} cellClassNames={CELLS} className={GRID} />
          {invitations.map((invitation) => (
            <TableRow key={invitation.id} className={GRID}>
              <span role="cell" className={cn('flex items-center gap-2.5', CELLS[0])}>
                <IconBox icon="mail" tone="neutral" size="sm" />
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
                  <Button label="Cancelar" variant="danger-soft" size="sm" onClick={() => onCancel(invitation)} />
                )}
                {(invitation.status === 'expired' || invitation.status === 'cancelled') && (
                  <Button label="Reenviar" variant="tonal" size="sm" onClick={() => onResend(invitation)} />
                )}
                {invitation.status === 'accepted' && <span className="text-label-l text-content-muted">—</span>}
              </span>
            </TableRow>
          ))}
        </TableCard>
      )}
    </section>
  )
}
