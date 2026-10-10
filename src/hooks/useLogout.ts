/**
 * Logout confirmation and session cleanup owned by the shell hook.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { useActiveCourse } from '@/context/ActiveCourseContext'
import { ROUTES } from '@/navigation/routes'
import { authService } from '@/services/auth.service'
import { useAuthMutation } from '@/hooks/useAuthMutation'

const logoutOperation = async (_input: void, signal: AbortSignal) => {
  await authService.logout(signal)
  return true
}

/**
 * Owns logout confirmation and clears the active course after confirmed sign-out.
 *
 * @returns `isOpen`, `open`, `cancel`, `confirm`, `isSubmitting` and `error` for the shell modal.
 *
 * @example
 * ```tsx
 * const logout = useLogout();
 * ```
 */
export function useLogout() {
  const navigate = useNavigate()
  const { setActiveCourseId } = useActiveCourse()
  const { submit, isSubmitting, error, clearError } = useAuthMutation(logoutOperation)
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => {
    clearError()
    setIsOpen(true)
  }, [clearError])
  const cancel = useCallback(() => {
    if (isSubmitting) return
    clearError()
    setIsOpen(false)
  }, [isSubmitting, clearError])
  const confirm = useCallback(async () => {
    if (await submit()) {
      setActiveCourseId(null)
      setIsOpen(false)
      navigate(ROUTES.signIn, { replace: true })
    }
  }, [submit, navigate, setActiveCourseId])
  return { isOpen, open, cancel, confirm, isSubmitting: isSubmitting, error: error?.message ?? null }
}
