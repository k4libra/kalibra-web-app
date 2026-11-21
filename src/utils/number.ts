/** Consistent numeric display at the precision used by the desktop frames.
 * @author Not specified
 * @packageDocumentation
 */
/** Rounds away floating point noise without changing API measurements. */
export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat('es-PE', { maximumFractionDigits: digits, useGrouping: false }).format(value)
}
/** Formats mastery change in percentage points, preserving its direction. */
export function formatDelta(value: number): string {
  const rounded = Math.round(Math.abs(value))
  return `${rounded === 0 ? '' : value > 0 ? '+' : '−'}${rounded} pts`
}
