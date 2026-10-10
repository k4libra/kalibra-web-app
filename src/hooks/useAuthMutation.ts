/**
 * Cancellable submission state shared by authentication hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { AuthError } from '@/types/auth'

/**
 * Runs one cancellable auth submission at a time and ignores obsolete completions.
 *
 * @typeParam T - Submission input.
 * @typeParam R - Result returned by the adapter.
 * @param operation - Stable service operation to execute.
 * @returns `submit`, `isSubmitting`, `error` and `clearError`.
 *
 * @example
 * ```ts
 * const mutation = useAuthMutation(authService.login);
 * ```
 */
export function useAuthMutation<T, R>(operation: (input: T, signal: AbortSignal) => Promise<R>) {
  const current = useRef<AbortController | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<AuthError | Error | null>(null)
  useEffect(
    () => () => {
      current.current?.abort()
      current.current = null
    },
    [],
  )
  const clearError = useCallback(() => setError(null), [])
  const submit = useCallback(
    async (input: T): Promise<R | null> => {
      if (current.current) return null
      const controller = new AbortController()
      current.current = controller
      setIsSubmitting(true)
      setError(null)
      try {
        const result = await operation(input, controller.signal)
        return controller.signal.aborted ? null : result
      } catch (reason: unknown) {
        if (!controller.signal.aborted)
          setError(reason instanceof Error ? reason : new Error('No se pudo completar la operación.'))
        return null
      } finally {
        if (!controller.signal.aborted) {
          current.current = null
          setIsSubmitting(false)
        }
      }
    },
    [operation],
  )
  return { submit, isSubmitting, error, clearError }
}
