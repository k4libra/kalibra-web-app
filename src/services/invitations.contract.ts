/**
 * Contract of the invitations endpoints, implemented by the HTTP service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { Invitation, SendInvitationResult } from '@/types/invitation'

/**
 * Operations the frontend needs to manage invitations.
 */
export interface InvitationsContract {
  /** Lists the invitations sent by the teacher to every course. */
  listInvitations: (signal?: AbortSignal) => Promise<Invitation[]>
  /** Invites the owner of an email to a course; resolves with `no-account` when the email is not registered. */
  sendInvitation: (courseId: string, email: string) => Promise<SendInvitationResult>
  /** Withdraws a pending invitation and returns it as cancelled. */
  cancelInvitation: (invitationId: string) => Promise<Invitation>
  /** Sends again an expired or cancelled invitation with a new 3-day validity. */
  resendInvitation: (invitationId: string) => Promise<Invitation>
}
