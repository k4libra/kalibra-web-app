/**
 * Hook that requests a batch of generated exercises.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { exercisesService } from '@/services/exercises.service'
import type { GenerationResult } from '@/types/exercise'

/**
 * Sends a generation request for a subtopic and exposes the request state.
 *
 * @returns `generate`, which resolves with the outcome or `null` on failure, and the `isSubmitting` and `error` state.
 *
 * @example
 * ```tsx
 * const { generate, isSubmitting } = useGenerateExercises();
 * ```
 */
export function useGenerateExercises() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (courseId: string, subtopicId: string): Promise<GenerationResult | null> => {
    setIsSubmitting(true)
    setError(null)
    try {
      return await exercisesService.generate(courseId, subtopicId)
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'No se pudieron generar los ejercicios.')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { generate, isSubmitting, error }
}
