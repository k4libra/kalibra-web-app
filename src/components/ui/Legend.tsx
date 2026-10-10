/**
 * Semantic color legend primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { Tone } from '@/types/ui'
import { cn } from '@/utils/cn'

/** Dot colors for each semantic family. */
const TONE_CLASS: Record<Tone, string> = {
  primary: 'bg-primary', success: 'bg-secondary-strong', warning: 'bg-tertiary',
  danger: 'bg-danger', neutral: 'bg-primary-container',
}

/** Describes one labeled legend item. */
export interface LegendItem {
  /** Meaning of the color. */
  label: string
  /** Semantic family displayed by the dot. */
  tone: Tone
}

/** Props accepted by {@link Legend}. */
export interface LegendProps {
  /** Legend items in presentation order. */
  items: LegendItem[]
  /** Accessible name of the legend. */
  label: string
}

/**
 * Renders a wrapping legend with semantic color dots.
 *
 * @example
 * ```tsx
 * <Legend label="Status" items={[{ label: 'Approved', tone: 'success' }]} />
 * ```
 */
export function Legend({ items, label }: LegendProps) {
  return <ul aria-label={label} className="flex flex-wrap gap-4 text-body-m text-content-secondary">
    {items.map((item) => <li key={item.label} className="flex items-center gap-1.5">
      <span aria-hidden className={cn('size-2.5 shrink-0 rounded-full', TONE_CLASS[item.tone])} />{item.label}
    </li>)}
  </ul>
}
