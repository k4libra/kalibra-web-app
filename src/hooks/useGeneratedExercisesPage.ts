/**
 * Hook of the generated exercises page.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useToast } from '@/context/ToastContext'
import { courseRoutes, ROUTES } from '@/navigation/routes'
import { plural } from '@/utils/plural'
import { useGenerateExercises } from './useGenerateExercises'
import { useGeneratedExercises } from './useGeneratedExercises'

// Query parameter that keeps the open exercise in the URL.
const DETAIL_PARAM = 'detalle'

/**
 * Loads the generated exercises and drives the detail drawer and the generation dialog.
 *
 * @returns The `groups` and `totals`, the `isLoading` and `error` state, the `selected` exercise with
 * `openExercise` and `closeExercise`, the dialog state (`isGenerateOpen`, `openGenerate`, `closeGenerate`),
 * `isGenerating`, `generate`, `uploadMaterial` and `goToCourses`.
 *
 * @example
 * ```tsx
 * const page = useGeneratedExercisesPage();
 * ```
 */
export function useGeneratedExercisesPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const { groups, totals, findExercise, isLoading, error, refetch } = useGeneratedExercises()
  const { generate: requestGeneration, isSubmitting: isGenerating } = useGenerateExercises()
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)

  const exerciseId = searchParams.get(DETAIL_PARAM)
  const selected = exerciseId ? findExercise(exerciseId) : null

  const openExercise = useCallback((id: string) => setSearchParams({ [DETAIL_PARAM]: id }), [setSearchParams])
  const closeExercise = useCallback(() => setSearchParams({}), [setSearchParams])
  const uploadMaterial = useCallback((courseId: string) => navigate(courseRoutes.material(courseId)), [navigate])

  const generate = useCallback(
    async (courseId: string, subtopicId: string) => {
      const result = await requestGeneration(courseId, subtopicId)
      if (!result) return
      setIsGenerateOpen(false)
      showToast({
        title: 'Generación completada',
        message: `${plural(result.generatedCount, 'ejercicio', 'ejercicios')} de ${result.subtopicName}: ${plural(result.approvedCount, 'aprobado', 'aprobados')} y ${plural(result.discardedCount, 'descartado', 'descartados')}.`,
      })
      refetch()
    },
    [refetch, requestGeneration, showToast],
  )

  return {
    groups,
    totals,
    isLoading,
    error,
    selected,
    openExercise,
    closeExercise,
    isGenerateOpen,
    openGenerate: () => setIsGenerateOpen(true),
    closeGenerate: () => setIsGenerateOpen(false),
    isGenerating,
    generate,
    uploadMaterial,
    goToCourses: () => navigate(ROUTES.courses),
  }
}
