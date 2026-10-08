/**
 * Toast primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IconName, Tone } from '@/types/ui'
import { cn } from '@/utils/cn'
import { IconBox } from './IconBox'

/**
 * Props accepted by {@link Toast}.
 */
export interface ToastProps {
  /** Short confirmation of what happened. */
  title: string
  /** Detail of the result. */
  message: string
  /**
   * Icon of the toast.
   *
   * @defaultValue `'check_circle'`
   */
  icon?: IconName
  /**
   * Color family of the icon box.
   *
   * @defaultValue `'success'`
   */
  tone?: Tone
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a floating confirmation card after an action finishes.
 *
 * @example
 * ```tsx
 * <Toast title="Course created" message="Linear Algebra was saved with 4 subtopics." />
 * ```
 */
export function Toast({ title, message, icon = 'check_circle', tone = 'success', className }: ToastProps) {
  return (
    <div
      role="status"
      className={cn('flex items-center gap-3 rounded-md border border-line-subtle bg-surface-card p-3.5 shadow-floating', className)}
    >
      <IconBox icon={icon} tone={tone} size="sm" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-label-l text-content-primary">{title}</p>
        <p className="text-body-m text-content-secondary">{message}</p>
      </div>
    </div>
  )
}
