/**
 * Tests for the invitations service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { invitationsService } from './invitations.service'

describe('invitationsService', () => {
  it('rejects an email without account without creating an invitation', async () => {
    const before = (await invitationsService.listInvitations()).length
    const result = await invitationsService.sendInvitation('course-1', 'carlos.vega@gmail.com')
    expect(result.status).toBe('no-account')
    expect(await invitationsService.listInvitations()).toHaveLength(before)
  })

  it('creates a pending invitation for a registered email', async () => {
    const result = await invitationsService.sendInvitation('course-1', 'carlos.vega@upc.edu.pe')
    expect(result.status === 'sent' && result.invitation.status).toBe('pending')
  })

  it('cancels and resends an invitation', async () => {
    expect((await invitationsService.cancelInvitation('inv-1')).status).toBe('cancelled')
    expect((await invitationsService.resendInvitation('inv-1')).status).toBe('pending')
  })
})
