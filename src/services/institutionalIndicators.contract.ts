/**
 * Defines the institutional analytics HTTP service contract.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CriticalSubtopic, InstitutionalIndicators } from '@/types/institutionalIndicators'
import type { IndicatorsExport } from '@/types/indicators'
/** Defines the read-only institutional analytics operations. */
export interface InstitutionalIndicatorsContract {
  /** Reads institutional totals and course aggregates. */
  getIndicators(signal?: AbortSignal): Promise<InstitutionalIndicators>
  /** Reads subtopics in server-defined reinforcement order. */
  getCriticalSubtopics(signal?: AbortSignal): Promise<CriticalSubtopic[]>
  /** Downloads the anonymized per-course CSV. */
  exportIndicators(signal?: AbortSignal): Promise<IndicatorsExport>
}
