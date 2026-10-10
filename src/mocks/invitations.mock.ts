/**
 * Simulated invitations endpoints with sample data taken from the Figma mockups.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { InvitationsContract } from '@/services/invitations.contract'
import type { Invitation } from '@/types/invitation'
import { isEmptyScenario, respond } from '@/mocks/scenario'
import { formatMonitoringDate } from '@/utils/monitoring'
import { STUDENTS } from '@/mocks/students.fixture'

/**
 * Sample invitations sent by the teacher.
 */
export const INVITATIONS: Invitation[] = [
  { id: 'inv-1', courseId: 'course-1', email: 'mateo.rios@upc.edu.pe', sentAt: '12 sep 2025, 09:30', validity: 'Vence en 2 días', status: 'pending' },
  { id: 'inv-2', courseId: 'course-1', email: 'ana.torres@upc.edu.pe', sentAt: '06 sep 2025, 11:05', validity: 'Venció el 09 sep 2025', status: 'expired' },
  { id: 'inv-3', courseId: 'course-1', email: STUDENTS[2].email, sentAt: '03 sep 2025, 15:12', validity: `Respondida el ${formatMonitoringDate(STUDENTS[2].enrolledAt)}`, status: 'accepted' },
]

/**
 * Emails that already have a student account, used to simulate the account check.
 */
export const REGISTERED_STUDENT_EMAILS = ['carlos.vega@upc.edu.pe', 'mateo.rios@upc.edu.pe', 'ana.torres@upc.edu.pe', ...STUDENTS.map((student) => student.email)]

// Updates an invitation in place and returns it.
function update(invitationId: string, changes: Partial<Invitation>): Promise<Invitation> {
  const invitation = INVITATIONS.find((item) => item.id === invitationId)
  if (!invitation) return Promise.reject(new Error(`Invitation ${invitationId} not found`))
  Object.assign(invitation, changes)
  return respond(invitation)
}

/**
 * Simulated implementation of {@link InvitationsContract}.
 */
export const invitationsMock: InvitationsContract = {
  listInvitations: () => respond(isEmptyScenario() ? [] : INVITATIONS),
  sendInvitation: (courseId, email) => {
    if (!REGISTERED_STUDENT_EMAILS.includes(email.trim().toLowerCase())) return respond({ status: 'no-account' as const })
    const invitation: Invitation = {
      id: `inv-${INVITATIONS.length + 1}`,
      courseId,
      email: email.trim().toLowerCase(),
      sentAt: 'Hoy',
      validity: 'Vence en 3 días',
      status: 'pending',
    }
    INVITATIONS.unshift(invitation)
    return respond({ status: 'sent' as const, invitation })
  },
  cancelInvitation: (invitationId) => update(invitationId, { status: 'cancelled', validity: 'Cancelada hoy' }),
  resendInvitation: (invitationId) => update(invitationId, { status: 'pending', sentAt: 'Hoy', validity: 'Vence en 3 días' }),
}
