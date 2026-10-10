/**
 * Interactive heatmap value primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { Tone } from '@/types/ui'
import { cn } from '@/utils/cn'

/** Background and text colors of an interactive heatmap value. */
const TONE_CLASS: Record<Tone, string> = {
  primary: 'bg-primary-container text-primary-strong',
  success: 'bg-secondary-container text-secondary-text',
  warning: 'bg-tertiary-pale text-tertiary-strong',
  danger: 'bg-danger-container text-danger-strong',
  neutral: 'bg-primary-container-soft text-content-muted',
}

/** Props accepted by {@link HeatmapCell}. */
export interface HeatmapCellProps {
  /** Formatted value displayed in the cell. */
  value: string
  /** Accessible description of the value and its destination. */
  label: string
  /**
   * Semantic color of the value.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone
  /** Called when the value is activated by pointer or keyboard. */
  onClick: () => void
}

/**
 * Renders an interactive, labeled value in a heatmap.
 *
 * @example
 * ```tsx
 * <HeatmapCell value="72%" label="Open measurement" tone="success" onClick={open} />
 * ```
 */
export function HeatmapCell({ value, label, tone = 'primary', onClick }: HeatmapCellProps) {
  return <button type="button" aria-label={label} onClick={onClick}
    className={cn('min-h-11 w-full cursor-pointer rounded-sm px-3 py-2 text-label-l transition-opacity hover:opacity-80', TONE_CLASS[tone])}>{value}</button>
}
