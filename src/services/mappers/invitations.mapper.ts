/**
 * Maps invitation responses without simulating expiry transitions.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { InvitationDto } from '@/types/api'
import type { Invitation } from '@/types/invitation'
/** Maps the server lifecycle and expiry timestamps to Spanish display values. */
export function mapInvitation(dto: InvitationDto): Invitation {
  return { id: dto.id, courseId: dto.courseId, email: dto.invitedEmail,
    status: dto.status === 'PENDING' ? 'pending' : dto.status === 'ACCEPTED' ? 'accepted' : dto.status === 'EXPIRED' ? 'expired' : 'cancelled',
    sentAt: new Date(dto.sentAt).toLocaleString('es-PE'), validity: `Vencimiento: ${new Date(dto.expiresAt).toLocaleString('es-PE')}` }
}
