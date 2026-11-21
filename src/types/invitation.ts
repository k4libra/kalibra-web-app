/**
 * Domain types of the invitations a teacher sends to students.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Lifecycle state of an invitation.
 *
 * @remarks
 * - `pending`: sent and waiting for an answer during its 3-day validity.
 * - `accepted`: the student joined the course.
 * - `expired`: the validity ended without an answer.
 * - `cancelled`: the teacher withdrew it.
 */
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled'

/**
 * Describes an invitation sent to a student.
 */
export interface Invitation {
  /** Unique identifier assigned by the server. */
  id: string
  /** Course the student is invited to. */
  courseId: string
  /** Institutional email of the invited student. */
  email: string
  /** Human-readable send date, for example `12 sep 2025, 09:30`. */
  sentAt: string
  /** Human-readable validity or answer date, for example `Vence en 2 días`. */
  validity: string
  /** Lifecycle state. */
  status: InvitationStatus
}

/**
 * Outcome of sending an invitation.
 *
 * @remarks
 * - `sent`: the invitation was created and is pending.
 * - `no-account`: the email has no Kalibra account; nothing was sent.
 */
export type SendInvitationResult = { status: 'sent'; invitation: Invitation } | { status: 'no-account' }
