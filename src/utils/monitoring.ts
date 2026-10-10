/**
 * Pure formatters and evidence-based student progress notices.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { StudentProgress } from '@/types/studentMonitoring'
import type { Subtopic } from '@/types/course'

/**
 * Formats a calendar date for enrollment notices.
 *
 * @param value - ISO calendar date or timestamp.
 * @returns A day, abbreviated month and year in Spanish.
 *
 * @example
 * ```ts
 * formatMonitoringDate('2025-09-04'); // '04 sep 2025'
 * ```
 */
export function formatMonitoringDate(value: string): string {
  const date = new Date(`${value.slice(0, 10)}T12:00:00Z`)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date).replace(/\./g, '')
}

/**
 * Formats a last-response timestamp against the snapshot date.
 *
 * @param value - Last response timestamp, or null without activity.
 * @param reference - Timestamp of the data snapshot.
 * @returns A relative day and time, or a calendar date for older activity.
 *
 * @example
 * ```ts
 * formatMonitoringActivity('2025-09-15T09:48:00', '2025-09-15T10:15:00'); // 'Hoy, 09:48'
 * ```
 */
export function formatMonitoringActivity(value: string | null, reference: string): string {
  if (!value) return 'Sin actividad'
  const day = Date.parse(`${value.slice(0, 10)}T00:00:00Z`)
  const today = Date.parse(`${reference.slice(0, 10)}T00:00:00Z`)
  const label = day === today ? 'Hoy' : today - day === 86400000 ? 'Ayer' : formatMonitoringDate(value)
  return `${label}, ${value.slice(11, 16)}`
}

/**
 * Formats an optional estimated mastery percentage.
 *
 * @param value - Percentage or null without responses.
 * @returns Rounded percentage or an em dash.
 *
 * @example
 * ```ts
 * formatMastery(62); // '62%'
 * ```
 */
export function formatMastery(value: number | null): string {
  return value === null ? '—' : `${Math.round(value)}%`
}

/**
 * Builds a reinforcement notice from explicit recommendations and response evidence.
 *
 * @param progress - Progress returned by the monitoring endpoint.
 * @param subtopics - Course labels used to name the recommended subtopics.
 * @returns A recommendation, or null when there is no recommendation evidence.
 *
 * @example
 * ```ts
 * reinforcementNotice(progress, subtopics); // 'Refuerzo sugerido: ...'
 * ```
 */
export function reinforcementNotice(progress: StudentProgress, subtopics: Subtopic[]): string | null {
  const items = progress.reinforcementSubtopicIds.flatMap((id) => {
    const topic = subtopics.find((item) => item.id === id)
    const record = progress.subtopics.find((item) => item.subtopicId === id)
    return topic && record?.mastery !== null && record?.mastery !== undefined ? [`${topic.name} (${formatMastery(record.mastery)})`] : []
  })
  if (!items.length) return null
  const recent = progress.recentResponses.filter((response) => response.subtopicId === progress.reinforcementSubtopicIds[0]).slice(0, 3)
  const evidence = items.length === 1 && recent.length === 3 && recent.every((response) => !response.isCorrect)
    ? ' Sus últimas 3 respuestas en este subtema fueron incorrectas.' : ''
  return `Refuerzo sugerido: ${items.join(' y ')}.${evidence}`
}
