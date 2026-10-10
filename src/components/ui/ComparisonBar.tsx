/**
 * Comparison bar primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { Tone } from '@/types/ui'
import { cn } from '@/utils/cn'

// Fill color of each tone.
const TONE_CLASS: Record<Tone, string> = {
  primary: 'bg-primary',
  success: 'bg-secondary-strong',
  warning: 'bg-tertiary',
  danger: 'bg-danger',
  neutral: 'bg-primary-pale',
}

/**
 * Props accepted by {@link ComparisonBar}.
 */
export interface ComparisonBarProps {
  /** Current value from 0 to 100; `null` draws an empty track. */
  value: number | null
  /** Reference value from 0 to 100 drawn as a dark marker; `null` hides it. */
  marker: number | null
  /** Color of the current value. */
  tone: Tone
  /** Accessible description of what the bar compares. */
  label: string
}

/**
 * Renders a 12 px track filled up to the current value with a marker at the reference value.
 *
 * @example
 * ```tsx
 * <ComparisonBar value={65} marker={41} tone="warning" label="Mastery today versus start" />
 * ```
 */
export function ComparisonBar({ value, marker, tone, label }: ComparisonBarProps) {
  return (
    <div role="img" aria-label={label} className="relative h-3 w-full overflow-hidden rounded-sm bg-primary-container">
      {value !== null && <div className={cn('h-full rounded-sm', TONE_CLASS[tone])} style={{ width: `${value}%` }} />}
      {marker !== null && <div className="absolute inset-y-0 w-0.75 bg-content-primary" style={{ left: `${marker}%` }} />}
    </div>
  )
}
