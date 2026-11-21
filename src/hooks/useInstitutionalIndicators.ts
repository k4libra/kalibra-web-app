/**
 * Loads administrator analytics through the shared resource lifecycle.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { useResource } from '@/hooks/useResource'
import { institutionalIndicatorsService } from '@/services/institutionalIndicators.service'
/**
 * Loads institutional analytics and controls CSV export.
 *
 * @returns The report, loading and error state, retry and download actions.
 * @example
 * ```tsx
 * const page = useInstitutionalIndicators();
 * ```
 */
export function useInstitutionalIndicators() {
  const resource = useResource(institutionalIndicatorsService.getIndicators, 'institutional-indicators')
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const download = useCallback(async () => {
    setIsExporting(true); setExportError(null)
    try { await institutionalIndicatorsService.exportIndicators() }
    catch (reason) { setExportError(reason instanceof Error ? reason.message : 'No se pudo exportar.') }
    finally { setIsExporting(false) }
  }, [])
  return { ...resource, isExporting, exportError, download }
}
/**
 * Loads critical subtopics in the API ranking order.
 *
 * @returns The ranking and its loading, error and retry state.
 * @example
 * ```tsx
 * const page = useCriticalSubtopics();
 * ```
 */
export function useCriticalSubtopics() {
  return useResource(institutionalIndicatorsService.getCriticalSubtopics, 'institutional-critical-subtopics')
}
