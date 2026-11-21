/**
 * Avatar primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { cn } from '@/utils/cn'

/**
 * Avatar presets: `sm` 32 px soft avatar for lists and `md` 36 px solid avatar for the signed-in user.
 */
export type AvatarSize = 'sm' | 'md'

// Dimension, colors and text scale of each size.
const SIZE_CLASS: Record<AvatarSize, string> = {
  sm: 'size-8 bg-primary-container text-body-m-bold text-primary-strong',
  md: 'size-9 bg-primary text-label-l text-content-on-primary',
}

/**
 * Props accepted by {@link Avatar}.
 */
export interface AvatarProps {
  /** One or two letters that identify the person. */
  initials: string
  /**
   * Dimension and color preset.
   *
   * @defaultValue `'md'`
   */
  size?: AvatarSize
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a round badge with the initials of a person.
 *
 * @example
 * ```tsx
 * <Avatar initials="RS" />
 * ```
 */
export function Avatar({ initials, size = 'md', className }: AvatarProps) {
  return (
    <span aria-hidden className={cn('inline-flex shrink-0 items-center justify-center rounded-full', SIZE_CLASS[size], className)}>
      {initials}
    </span>
  )
}
