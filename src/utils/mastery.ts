/**
 * Presentation helpers for mastery percentages.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { Tone } from '@/types/ui'

/**
 * Mastery below this percentage is shown as low (red).
 */
export const LOW_MASTERY_THRESHOLD = 40

/**
 * Mastery from this percentage is shown as high (green).
 */
export const HIGH_MASTERY_THRESHOLD = 70

/**
 * Chooses the color family that represents a mastery level.
 *
 * @param mastery - Percentage from 0 to 100; `null` when there is no data.
 * @returns `danger` for low, `warning` for medium, `success` for high and `neutral` without data.
 *
 * @example
 * ```ts
 * masteryTone(65); // 'warning'
 * ```
 */
export function masteryTone(mastery: number | null): Tone {
  if (mastery === null) return 'neutral'
  if (mastery < LOW_MASTERY_THRESHOLD) return 'danger'
  if (mastery < HIGH_MASTERY_THRESHOLD) return 'warning'
  return 'success'
}
