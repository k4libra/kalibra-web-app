/**
 * Draws a closed storage box for archive actions.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IconSize } from '../Icon'
import { ICON_SIZE_CLASS } from '../iconSizes'
import { cn } from '@/utils/cn'

/** Props accepted by {@link ArchiveIcon}. */
export interface ArchiveIconProps {
  /**
   * Optical size shared with the icon primitive.
   *
   * @defaultValue `'md'`
   */
  size?: IconSize
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a decorative closed box with a lid band and a horizontal handle slot.
 *
 * @example
 * ```tsx
 * <ArchiveIcon size="lg" />
 * ```
 */
export function ArchiveIcon({ size = 'md', className }: ArchiveIconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"
    className={cn('shrink-0', ICON_SIZE_CLASS[size], className)}>
    <path d="M4 9v11h16V9M3 4h18v5H3z" />
    <rect x="9" y="12" width="6" height="2" rx="1" />
  </svg>
}
