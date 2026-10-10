/**
 * Stacked bar primitive of the design system.
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
  neutral: 'bg-primary-container',
}

/**
 * One segment of a {@link StackedBar}.
 */
export interface StackedBarSegment {
  /** Name of the segment, also used as key. */
  label: string
  /** Amount of the segment. */
  value: number
  /** Color of the segment. */
  tone: Tone
}

/**
 * Props accepted by {@link StackedBar}.
 */
export interface StackedBarProps {
  /** Segments in display order. */
  segments: StackedBarSegment[]
  /** Accessible description of the bar. */
  label: string
}

/**
 * Renders a horizontal bar split into segments proportional to their values.
 *
 * @example
 * ```tsx
 * <StackedBar label="Approved and discarded" segments={[{ label: 'Approved', value: 36, tone: 'success' }]} />
 * ```
 */
export function StackedBar({ segments, label }: StackedBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1
  return (
    <div role="img" aria-label={label} className="flex h-3.5 w-full gap-0.75">
      {segments
        .filter((segment) => segment.value > 0)
        .map((segment) => (
          <div key={segment.label} className={cn('h-full rounded-sm', TONE_CLASS[segment.tone])} style={{ width: `${(segment.value / total) * 100}%` }} />
        ))}
    </div>
  )
}
