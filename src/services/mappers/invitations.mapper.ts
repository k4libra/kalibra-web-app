/**
 * Maps invitation responses without simulating expiry transitions.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { InvitationDto } from '@/types/api'
import type { Invitation } from '@/types/invitation'
import { daysUntil, formatShortDate, formatShortDateTime } from '@/utils/date'
/** Maps the server lifecycle and expiry timestamps to Spanish display values. */
export function mapInvitation(dto: InvitationDto): Invitation {
  const now = new Date()
  const status = dto.status === 'PENDING' ? 'pending' : dto.status === 'ACCEPTED' ? 'accepted' : dto.status === 'EXPIRED' ? 'expired' : 'cancelled'
  return { id: dto.id, courseId: dto.courseId, email: dto.invitedEmail, status,
    sentAt: formatShortDateTime(dto.sentAt), validity: validityLabel(status, dto.expiresAt, now) }
}
/** Validity copy per lifecycle state; the API exposes no response timestamp. */
function validityLabel(status: Invitation['status'], expiresAt: string, now: Date): string {
  if (status === 'pending') {
    const days = daysUntil(expiresAt, now)
    return days === 0 ? 'Vence hoy' : `Vence en ${days} ${days === 1 ? 'día' : 'días'}`
  }
  if (status === 'expired') return `Venció el ${formatShortDate(expiresAt)}`
  if (status === 'accepted') return `Aceptada dentro de la vigencia`
  return `Vigencia hasta el ${formatShortDate(expiresAt)}`
}
