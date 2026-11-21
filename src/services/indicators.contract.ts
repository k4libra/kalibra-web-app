/**
 * Contract of the course indicators endpoints, implemented by the HTTP service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IndicatorGuideDto } from '@/types/api'
import type { CourseIndicators, IndicatorsExport } from '@/types/indicators'

/**
 * Operations the frontend needs to read and export the indicators of a course.
 */
export interface IndicatorsContract {
  /** Reads the official interpretation guide for a course. */
  getGuide: (courseId: string, signal?: AbortSignal) => Promise<IndicatorGuideDto>
  /** Fetches the indicators of a course; resolves with `null` while no student has solved exercises. */
  getIndicators: (courseId: string, signal?: AbortSignal) => Promise<CourseIndicators | null>
  /** Exports the indicators of a course as an anonymous CSV file. */
  exportIndicators: (courseId: string) => Promise<IndicatorsExport>
}
