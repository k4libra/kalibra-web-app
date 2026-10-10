/**
 * Register form state, validation and navigation.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useActiveCourse } from '@/context/ActiveCourseContext'
import { authService } from '@/services/auth.service'
import { ROUTES } from '@/navigation/routes'
import type { AuthFieldErrors, AuthFormValues } from '@/types/auth'
import { AuthError } from '@/types/auth'
import { validateAuth, toRegisterRequest } from '@/utils/authValidation'
import { useAuthMutation } from '@/hooks/useAuthMutation'

/**
 * Owns registration fields, validation and successful navigation.
 *
 * @returns The form `values`, `errors`, `onChange`, `onSubmit`, `isSubmitting` and recovery actions.
 *
 * @example
 * ```tsx
 * const form = useRegister();
 * ```
 */
export function useRegister() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const { setActiveCourseId } = useActiveCourse()
  const { submit, isSubmitting, error, clearError } = useAuthMutation(authService.register)
  const [values, setValues] = useState<AuthFormValues>({ fullName: '', email: '', password: '' })
  const [errors, setErrors] = useState<AuthFieldErrors>({})
  const onChange = useCallback(
    (field: keyof AuthFormValues, value: string) => {
      setValues((previous) => ({ ...previous, [field]: value }))
      setErrors((previous) => ({ ...previous, [field]: undefined }))
      if (field === 'email') clearError()
    },
    [clearError],
  )
  const onSubmit = useCallback(async () => {
    const nextErrors = validateAuth(values, true)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    const result = await submit(toRegisterRequest(values))
    if (result) {
      setActiveCourseId(null)
      navigate({ pathname: ROUTES.courses, search }, { replace: true })
    }
  }, [values, submit, navigate, search, setActiveCourseId])

  const isDuplicateEmail = error instanceof AuthError && error.code === 'duplicate-email'
  const useAnotherEmail = useCallback(() => {
    clearError()
    setErrors({})
    setValues((previous) => ({ ...previous, email: '' }))
  }, [clearError])

  return {
    values,
    errors,
    onChange,
    onSubmit,
    isSubmitting: isSubmitting,
    error: error?.message ?? null,
    onDismiss: clearError,
    isDuplicateEmail,
    onUseAnotherEmail: useAnotherEmail,
    onAlternate: useCallback(() => navigate({ pathname: ROUTES.signIn, search }), [navigate, search]),
  }
}
