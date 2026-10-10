/**
 * Integrates invitations with the enrollment HTTP endpoints.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { InvitationsContract } from '@/services/invitations.contract'
import { apiClient } from '@/services/http/apiClient'
import { mapInvitation } from '@/services/mappers/invitations.mapper'
import type { InvitationDto, InvitationGroupDto } from '@/types/api'
import { ApiError } from '@/types/apiError'
/** Reads and mutates server-owned invitation lifecycles. */
export const invitationsService: InvitationsContract = {
  async listInvitations(signal) { return (await apiClient.get<InvitationGroupDto[]>('/course-invitation-groups', { signal })).flatMap((group) => group.invitations.map(mapInvitation)) },
  async sendInvitation(courseId, email) {
    try { return { status: 'sent', invitation: mapInvitation(await apiClient.post<InvitationDto>('/invitations', { courseId, studentEmail: email })) } }
    catch (reason) { if (reason instanceof ApiError && reason.status === 422) return { status: 'no-account' }; throw reason }
  },
  async cancelInvitation(invitationId) { return mapInvitation(await apiClient.post<InvitationDto>(`/invitations/${invitationId}/cancellations`)) },
  async resendInvitation(invitationId) { return mapInvitation(await apiClient.post<InvitationDto>(`/invitations/${invitationId}/renewals`)) },
}
