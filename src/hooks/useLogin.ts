/**
 * Login form state, validation and navigation.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useActiveCourse } from '@/context/ActiveCourseContext'
import { authService } from '@/services/auth.service'
import { sessionHome } from '@/utils/sessionHome'
import { ROUTES } from '@/navigation/routes'
import type { AuthFieldErrors, AuthFormValues } from '@/types/auth'
import { validateAuth } from '@/utils/authValidation'
import { useAuthMutation } from '@/hooks/useAuthMutation'

/**
 * Owns sign-in fields, validation and successful navigation.
 *
 * @returns The form `values`, `errors`, `onChange`, `onSubmit`, `isSubmitting` and recovery actions.
 *
 * @example
 * ```tsx
 * const form = useLogin();
 * ```
 */
export function useLogin() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const { setActiveCourseId } = useActiveCourse()
  const { submit, isSubmitting, error, clearError } = useAuthMutation(authService.login)
  const [values, setValues] = useState<AuthFormValues>({ fullName: '', email: '', password: '' })
  const [errors, setErrors] = useState<AuthFieldErrors>({})
  const onChange = useCallback((field: keyof AuthFormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
  }, [])
  const onSubmit = useCallback(async () => {
    const nextErrors = validateAuth(values, false)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    const result = await submit({ email: values.email.trim(), password: values.password })
    if (result) {
      setActiveCourseId(null)
      navigate({ pathname: sessionHome(result.user.role), search }, { replace: true })
    }
  }, [values, submit, navigate, search, setActiveCourseId])

  return {
    values,
    errors,
    onChange,
    onSubmit,
    isSubmitting: isSubmitting,
    error: error?.message ?? null,
    onDismiss: clearError,
    onAlternate: useCallback(() => navigate({ pathname: ROUTES.signUp, search }), [navigate, search]),
  }
}
