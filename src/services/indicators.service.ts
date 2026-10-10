/**
 * Reads progress indicators and exports their API-provided CSV.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IndicatorsContract } from '@/services/indicators.contract'
import { apiClient } from '@/services/http/apiClient'
import { downloadCsv } from '@/services/http/download'
import { mapIndicatorGuide, mapIndicators } from '@/services/mappers/indicators.mapper'
import type { CatalogDto, IndicatorGuideDto, IndicatorsDto } from '@/types/api'
/** Reads real indicators, their guide and the anonymized CSV export. */
export const indicatorsService: IndicatorsContract = {
  async getIndicators(courseId, signal) {
    const [report, catalogs] = await Promise.all([apiClient.get<IndicatorsDto>(`/courses/${courseId}/indicators`, { signal }), apiClient.get<CatalogDto[]>('/course-exercise-catalogs', { signal })])
    return mapIndicators(report, catalogs.find((item) => item.courseId === courseId))
  },
  exportIndicators: (courseId) => downloadCsv(`/courses/${courseId}/indicators`, `indicadores-${courseId}.csv`),
  getGuide: async (courseId, signal) => mapIndicatorGuide(await apiClient.get<IndicatorGuideDto>(`/courses/${courseId}/indicators/guide`, { signal })),
}
