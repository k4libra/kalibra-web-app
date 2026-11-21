/**
 * Tests for the invitations hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useInvitationActions, useInvitations } from './useInvitations'

describe('useInvitations', () => {
  it('groups the invitations by course and counts them by state', async () => {
    const { result } = renderHook(() => useInvitations())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.groups.length).toBeGreaterThan(0)
    expect(result.current.pendingCount + result.current.acceptedCount + result.current.closedCount).toBeGreaterThan(0)
  })
})

describe('useInvitationActions', () => {
  it('reports when the email has no account', async () => {
    const { result } = renderHook(() => useInvitationActions())
    let outcome = null
    await act(async () => {
      outcome = await result.current.send('course-1', 'nobody@gmail.com')
    })
    expect(outcome).toEqual({ status: 'no-account' })
  })
})
