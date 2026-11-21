/**
 * Hook of the invitations page.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useToast } from '@/context/ToastContext'
import { ROUTES } from '@/navigation/routes'
import type { Invitation } from '@/types/invitation'
import { useInvitationActions, useInvitations } from './useInvitations'

/**
 * Loads the invitations and drives the invite dialog and the cancel and resend actions.
 *
 * @returns The `groups` and counters from {@link useInvitations}, the invite dialog state
 * (`isInviteOpen`, `openInvite`, `closeInvite`, `rejectedEmail`, `send`), the cancellation state
 * (`toCancel`, `askCancel`, `closeCancel`, `confirmCancel`), `resend`, `isSubmitting` and `goToCourses`.
 *
 * @example
 * ```tsx
 * const page = useInvitationsPage();
 * ```
 */
export function useInvitationsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [initialCourseId, setInitialCourseId] = useState(searchParams.get('curso') ?? '')
  const { showToast } = useToast()
  const invitations = useInvitations()
  const actions = useInvitationActions()
  const [isInviteOpen, setIsInviteOpen] = useState(searchParams.get('invitar') === '1')
  const [rejectedEmail, setRejectedEmail] = useState<string | null>(null)
  const [toCancel, setToCancel] = useState<Invitation | null>(null)
  const { refetch } = invitations

  const closeInvite = useCallback(() => {
    setIsInviteOpen(false)
    setRejectedEmail(null)
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const send = useCallback(
    async (courseId: string, email: string) => {
      const result = await actions.send(courseId, email)
      if (!result) return
      if (result.status === 'no-account') {
        setRejectedEmail(email)
        return
      }
      closeInvite()
      showToast({ placement: 'inline', title: 'Invitación enviada', message: `${result.invitation.email} tiene 3 días para aceptarla.` })
      refetch()
    },
    [actions, closeInvite, refetch, showToast],
  )

  const confirmCancel = useCallback(async () => {
    if (!toCancel) return
    const cancelled = await actions.cancel(toCancel.id)
    setToCancel(null)
    if (!cancelled) return
    showToast({ placement: 'inline',
      title: 'Invitación cancelada',
      message: `${cancelled.email} ya no puede aceptarla. Puedes reenviarla cuando quieras.`,
      icon: 'info',
      tone: 'primary',
    })
    refetch()
  }, [actions, refetch, showToast, toCancel])

  const resend = useCallback(
    async (invitation: Invitation) => {
      const resent = await actions.resend(invitation.id)
      if (!resent) return
      showToast({ placement: 'inline', title: 'Invitación reenviada', message: `${resent.email} tiene una nueva vigencia de 3 días.` })
      refetch()
    },
    [actions, refetch, showToast],
  )

  return {
    ...invitations,
    error: invitations.error ?? actions.error,
    isSubmitting: actions.isSubmitting,
    isInviteOpen,
    initialCourseId,
    openInvite: (courseId?: string) => { setInitialCourseId(courseId ?? ''); setIsInviteOpen(true) },
    closeInvite,
    rejectedEmail,
    send,
    toCancel,
    askCancel: setToCancel,
    closeCancel: () => setToCancel(null),
    confirmCancel,
    resend,
    goToCourses: () => navigate(ROUTES.courses),
  }
}
