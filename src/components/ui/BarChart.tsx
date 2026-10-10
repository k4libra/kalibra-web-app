/**
 * Vertical bar chart primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { cn } from '@/utils/cn'

/**
 * One bar of a {@link BarChart}.
 */
export interface BarChartItem {
  /** Stable key of the bar. */
  id: string
  /** Text under the bar. */
  label: string
  /** Value drawn above the bar and used for its height. */
  value: number
}

/**
 * Props accepted by {@link BarChart}.
 */
export interface BarChartProps {
  /** Bars in display order. */
  items: BarChartItem[]
  /** Accessible description of the chart. */
  label: string
  /** Layout classes from the parent. */
  className?: string
}

// Height of the tallest bar, in pixels.
const MAX_BAR_HEIGHT = 108

/**
 * Renders vertical bars scaled to the largest value; a zero value draws a short empty bar.
 *
 * @example
 * ```tsx
 * <BarChart label="Exercises per subtopic" items={[{ id: 'a', label: 'Recursion', value: 30 }]} />
 * ```
 */
export function BarChart({ items, label, className }: BarChartProps) {
  const max = Math.max(1, ...items.map((item) => item.value))
  return (
    <figure aria-label={label} className={cn('flex items-end gap-3 overflow-x-auto sm:gap-4', className)}>
      {items.map((item) => (
        <div key={item.id} className="flex min-w-20 flex-1 flex-col items-center gap-1.5">
          <span className={cn('text-label-l', item.value > 0 ? 'text-content-primary' : 'text-content-secondary')}>{item.value}</span>
          <div
            className={cn('w-14 rounded-sm', item.value > 0 ? 'bg-primary-strong' : 'bg-primary-container')}
            style={{ height: item.value > 0 ? Math.max(8, (item.value / max) * MAX_BAR_HEIGHT) : 4 }}
          />
          <span className="min-h-8 text-center text-body-m text-content-secondary">{item.label}</span>
        </div>
      ))}
    </figure>
  )
}
