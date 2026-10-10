/**
 * Hooks that read and change the invitations of the teacher.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { coursesService } from '@/services/courses.service'
import { invitationsService } from '@/services/invitations.service'
import type { CourseOverview } from '@/types/course'
import type { Invitation, SendInvitationResult } from '@/types/invitation'
import { useResource } from './useResource'

/**
 * Invitations of one course, ready to render as a group.
 */
export interface CourseInvitationGroup {
  /** Course of the group. */
  course: CourseOverview
  /** Invitations sent to the course, newest first. */
  invitations: Invitation[]
}

/**
 * Loads the courses of the teacher with the invitations sent to each one.
 *
 * @returns The `groups` per course, the counters (`pendingCount`, `acceptedCount`, `closedCount`),
 * the `isLoading` and `error` state, and `refetch`.
 *
 * @example
 * ```tsx
 * const { groups, pendingCount } = useInvitations();
 * ```
 */
export function useInvitations() {
  const { data, isLoading, error, refetch } = useResource(async (signal) => {
    const [courses, invitations] = await Promise.all([coursesService.listCourses(signal), invitationsService.listInvitations(signal)])
    return courses.map<CourseInvitationGroup>((course) => ({
      course,
      invitations: invitations.filter((invitation) => invitation.courseId === course.id),
    }))
  }, 'invitations')

  const groups = data ?? []
  const all = groups.flatMap((group) => group.invitations)
  return {
    groups,
    pendingCount: all.filter((invitation) => invitation.status === 'pending').length,
    acceptedCount: all.filter((invitation) => invitation.status === 'accepted').length,
    closedCount: all.filter((invitation) => invitation.status === 'expired' || invitation.status === 'cancelled').length,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Exposes the invitation actions and whether one is running.
 *
 * @returns `send`, `cancel` and `resend`, which resolve with the result or `null` on failure, and the
 * `isSubmitting` and `error` state.
 *
 * @example
 * ```tsx
 * const { send, isSubmitting } = useInvitationActions();
 * ```
 */
export function useInvitationActions() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async <T,>(action: () => Promise<T>): Promise<T | null> => {
    setIsSubmitting(true)
    setError(null)
    try {
      return await action()
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'No se pudo completar la acción.')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const send = useCallback(
    (courseId: string, email: string): Promise<SendInvitationResult | null> => run(() => invitationsService.sendInvitation(courseId, email)),
    [run],
  )
  const cancel = useCallback((invitationId: string) => run(() => invitationsService.cancelInvitation(invitationId)), [run])
  const resend = useCallback((invitationId: string) => run(() => invitationsService.resendInvitation(invitationId)), [run])

  return { send, cancel, resend, isSubmitting, error }
}
