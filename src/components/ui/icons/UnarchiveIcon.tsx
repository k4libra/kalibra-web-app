/**
 * Draws an open storage box for unarchive actions.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { ICON_SIZE_CLASS } from '../iconSizes'
import type { ArchiveIconProps } from './ArchiveIcon'
import { cn } from '@/utils/cn'

/** Props accepted by {@link UnarchiveIcon}. */
export type UnarchiveIconProps = ArchiveIconProps

/**
 * Renders a decorative storage box with its lid lifted clearly above its body.
 *
 * @example
 * ```tsx
 * <UnarchiveIcon size="lg" />
 * ```
 */
export function UnarchiveIcon({ size = 'md', className }: UnarchiveIconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"
    className={cn('shrink-0', ICON_SIZE_CLASS[size], className)}>
    <path d="M4 11h16v10H4zM4 11 20.9 4.8 19.5 1.1 2.6 7.3z" />
    <rect x="9" y="13" width="6" height="2" rx="1" />
  </svg>
}
