/**
 * Callout primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import type { IconName } from '@/types/ui'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

/**
 * Color families of a callout: `info` (indigo), `warning` (amber) and `danger` (red).
 */
export type CalloutTone = 'info' | 'warning' | 'danger'

// Background and text color of each tone.
const TONE_CLASS: Record<CalloutTone, string> = {
  info: 'bg-primary-subtle text-content-primary',
  warning: 'bg-tertiary-pale text-content-primary',
  danger: 'bg-danger-container text-danger-strong',
}

// Icon color of each tone.
const ICON_CLASS: Record<CalloutTone, string> = {
  info: 'text-primary',
  warning: 'text-tertiary-strong',
  danger: 'text-danger-strong',
}

/**
 * Props accepted by {@link Callout}.
 */
export interface CalloutProps {
  /** Icon that introduces the message. */
  icon: IconName
  /** Message content. */
  children: ReactNode
  /**
   * Color family.
   *
   * @defaultValue `'info'`
   */
  tone?: CalloutTone
  /**
   * Text scale: `md` for page hints and `sm` for dialog validation messages.
   *
   * @defaultValue `'md'`
   */
  size?: 'sm' | 'md'
  /** Optional action placed at the end, such as a small button. */
  action?: ReactNode
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a tinted message box for hints, warnings and validation errors.
 *
 * @example
 * ```tsx
 * <Callout icon="lightbulb">Carga el material de cada subtema.</Callout>
 * ```
 */
export function Callout({ icon, children, tone = 'info', size = 'md', action, className }: CalloutProps) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : undefined}
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center',
        size === 'md' ? 'rounded-md px-4 py-3 text-body-l' : 'rounded-sm px-3 py-2.5 text-body-m',
        TONE_CLASS[tone],
        className,
      )}
    >
      <div className="flex flex-1 items-start gap-3 sm:items-center">
        <Icon name={icon} size={size === 'md' ? 'lg' : 'md'} className={ICON_CLASS[tone]} />
        <div className="flex-1">{children}</div>
      </div>
      {action && <div className="self-end sm:self-auto">{action}</div>}
    </div>
  )
}
