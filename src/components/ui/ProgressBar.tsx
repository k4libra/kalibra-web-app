/**
 * Progress bar primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { Tone } from '@/types/ui'
import { cn } from '@/utils/cn'

/**
 * Track thickness presets: `sm` 8 px, `md` 10 px and `lg` 12 px.
 */
export type ProgressBarSize = 'sm' | 'md' | 'lg'

// Fill color of each tone.
const TONE_CLASS: Record<Tone, string> = {
  primary: 'bg-primary',
  success: 'bg-secondary-strong',
  warning: 'bg-tertiary',
  danger: 'bg-danger',
  neutral: 'bg-primary-pale',
}

// Track thickness of each size.
const SIZE_CLASS: Record<ProgressBarSize, string> = {
  sm: 'h-2',
  md: 'h-2.5',
  lg: 'h-3',
}

/**
 * Props accepted by {@link ProgressBar}.
 */
export interface ProgressBarProps {
  /** Filled percentage from 0 to 100; `null` draws an empty track (no data). */
  value: number | null
  /** Accessible description of what the bar measures. */
  label: string
  /**
   * Fill color.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone
  /**
   * Track thickness.
   *
   * @defaultValue `'sm'`
   */
  size?: ProgressBarSize
  /** Layout classes from the parent (usually the width). */
  className?: string
}

/**
 * Renders a rounded track filled up to a percentage.
 *
 * @example
 * ```tsx
 * <ProgressBar value={56} label="Group mastery" />
 * ```
 */
export function ProgressBar({ value, label, tone = 'primary', size = 'sm', className }: ProgressBarProps) {
  const width = value === null ? 0 : Math.min(100, Math.max(0, value))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value ?? undefined}
      className={cn('w-full overflow-hidden rounded-full bg-primary-container-soft', SIZE_CLASS[size], className)}
    >
      {value !== null && <div className={cn('h-full rounded-full', TONE_CLASS[tone])} style={{ width: `${width}%` }} />}
    </div>
  )
}
