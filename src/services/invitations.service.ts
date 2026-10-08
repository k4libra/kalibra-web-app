/**
 * Invitations service used by the hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { invitationsMock } from '@/mocks/invitations.mock'
import type { InvitationsContract } from './invitations.contract'

/**
 * Lists, sends, cancels and resends invitations.
 *
 * @remarks
 * Points to the simulated implementation until the backend integration is built.
 */
export const invitationsService: InvitationsContract = invitationsMock
