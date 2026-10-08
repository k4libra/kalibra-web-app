/**
 * Chip primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IconName, Tone } from '@/types/ui'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

// Background and text color of each tone.
const TONE_CLASS: Record<Tone, string> = {
  primary: 'bg-primary-container-soft text-primary-strong',
  success: 'bg-secondary-container text-secondary-text',
  warning: 'bg-tertiary-pale text-tertiary-strong',
  danger: 'bg-danger-container text-danger-strong',
  neutral: 'bg-primary-container text-content-secondary',
}

/**
 * Props accepted by {@link Chip}.
 */
export interface ChipProps {
  /** Text of the chip. */
  label: string
  /**
   * Color family that conveys the state.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone
  /** Icon rendered before the label. */
  icon?: IconName
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a compact status or count label.
 *
 * @example
 * ```tsx
 * <Chip label="Listo" tone="success" icon="check_circle" />
 * ```
 */
export function Chip({ label, tone = 'primary', icon, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit shrink-0 items-center gap-1 rounded-sm px-2.5 py-0.5 text-body-m-bold whitespace-nowrap',
        TONE_CLASS[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size="xs" />}
      {label}
    </span>
  )
}
