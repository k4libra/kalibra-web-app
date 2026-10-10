/**
 * Hooks that read and export the indicators of a course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { coursesService } from '@/services/courses.service'
import { indicatorsService } from '@/services/indicators.service'
import type { IndicatorsExport } from '@/types/indicators'
import { useResource } from './useResource'

/**
 * Loads a course and its indicators.
 *
 * @param courseId - Course to load.
 * @returns The `course` and its `indicators` (`null` while loading or without activity), the
 * `isLoading` and `error` state, and `refetch`.
 *
 * @example
 * ```tsx
 * const { course, indicators } = useCourseIndicators(courseId);
 * ```
 */
export function useCourseIndicators(courseId: string) {
  const { data, isLoading, error, refetch } = useResource(
    (signal) => Promise.all([coursesService.getCourse(courseId, signal), indicatorsService.getIndicators(courseId, signal)]),
    `indicators-${courseId}`,
  )
  return { course: data?.[0] ?? null, indicators: data?.[1] ?? null, isLoading, error, refetch }
}

/**
 * Requests the anonymous CSV export of the indicators.
 *
 * @returns `exportIndicators`, which resolves with the file or `null` on failure, and the `isExporting` and `error` state.
 *
 * @example
 * ```tsx
 * const { exportIndicators } = useExportIndicators();
 * ```
 */
export function useExportIndicators() {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportIndicators = useCallback(async (courseId: string): Promise<IndicatorsExport | null> => {
    setIsExporting(true)
    setError(null)
    try {
      return await indicatorsService.exportIndicators(courseId)
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'No se pudo exportar.')
      return null
    } finally {
      setIsExporting(false)
    }
  }, [])

  return { exportIndicators, isExporting, error }
}
