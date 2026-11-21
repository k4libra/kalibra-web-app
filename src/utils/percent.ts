/**
 * Percentage helpers for the indicators.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Calculates a rounded percentage.
 *
 * @param part - Amount counted, for example correct answers.
 * @param total - Reference amount, for example answers submitted.
 * @returns The rounded percentage from 0 to 100, or `null` when `total` is 0.
 *
 * @example
 * ```ts
 * percent(48, 69); // 70
 * ```
 */
export function percent(part: number, total: number): number | null {
  return total === 0 ? null : Math.round((part / total) * 100)
}
