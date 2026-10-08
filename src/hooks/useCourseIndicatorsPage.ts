/**
 * Hook of the course indicators page.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { useToast } from '@/context/ToastContext'
import { courseRoutes, ROUTES } from '@/navigation/routes'
import { useCourseIndicators, useExportIndicators } from './useCourseIndicators'

/**
 * Loads the indicators of a course and drives the guide and export dialogs.
 *
 * @param courseId - Course shown on the page.
 * @returns The `course`, its `indicators`, the `isLoading` and `error` state, the dialog state
 * (`isGuideOpen`, `openGuide`, `closeGuide`, `isExportOpen`, `openExport`, `closeExport`),
 * `isExporting`, `download`, `goToExercises` and `goToMaterial`.
 *
 * @example
 * ```tsx
 * const page = useCourseIndicatorsPage(courseId);
 * ```
 */
export function useCourseIndicatorsPage(courseId: string) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { course, indicators, isLoading, error } = useCourseIndicators(courseId)
  const { exportIndicators, isExporting, error: exportError } = useExportIndicators()
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)

  const download = useCallback(async () => {
    const file = await exportIndicators(courseId)
    setIsExportOpen(false)
    if (file) showToast({ title: 'Indicadores exportados', message: `${file.fileName} descargado`, icon: 'download_done' })
  }, [courseId, exportIndicators, showToast])

  return {
    course,
    indicators,
    isLoading,
    error: error ?? exportError,
    isGuideOpen,
    openGuide: () => setIsGuideOpen(true),
    closeGuide: () => setIsGuideOpen(false),
    isExportOpen,
    openExport: () => setIsExportOpen(true),
    closeExport: () => setIsExportOpen(false),
    isExporting,
    download,
    goToExercises: () => navigate(ROUTES.exercises),
    goToMaterial: () => navigate(courseRoutes.material(courseId)),
  }
}
