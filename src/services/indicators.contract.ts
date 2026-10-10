/**
 * Contract of the course indicators endpoints, shared by the real and the simulated service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CourseIndicators, IndicatorsExport } from '@/types/indicators'

/**
 * Operations the frontend needs to read and export the indicators of a course.
 */
export interface IndicatorsContract {
  /** Fetches the indicators of a course; resolves with `null` while no student has solved exercises. */
  getIndicators: (courseId: string) => Promise<CourseIndicators | null>
  /** Exports the indicators of a course as an anonymous CSV file. */
  exportIndicators: (courseId: string) => Promise<IndicatorsExport>
}
