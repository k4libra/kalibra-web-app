/**
 * Short Spanish date labels used by the UI v2 tables ("12 sep 2025", "12 sep 2025, 09:30").
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const DAY_MS = 24 * 60 * 60 * 1000

/** Formats a date as `12 sep 2025`. */
export function formatShortDate(value: string | Date): string {
  const date = new Date(value)
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** Formats a date and 24-hour time as `12 sep 2025, 09:30`. */
export function formatShortDateTime(value: string | Date): string {
  const date = new Date(value)
  return `${formatShortDate(date)}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/** Whole days remaining until `value` (0 when it expires today or already expired). */
export function daysUntil(value: string | Date, now: Date = new Date()): number {
  return Math.max(0, Math.ceil((new Date(value).getTime() - now.getTime()) / DAY_MS))
}

/** Formats `Hoy, 10:12`, `Ayer, 16:40` or `12 sep 2025, 09:30` relative to `now`. */
export function formatRelativeDateTime(value: string | Date, now: Date = new Date()): string {
  const date = new Date(value)
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  const startOfDay = (day: Date) => new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime()
  const diff = Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS)
  if (diff === 0) return `Hoy, ${time}`
  if (diff === 1) return `Ayer, ${time}`
  return formatShortDateTime(date)
}
