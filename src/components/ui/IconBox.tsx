/**
 * Icon container primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IconName, Tone } from '@/types/ui'
import { cn } from '@/utils/cn'
import { Icon, type IconSize } from './Icon'

/**
 * Box presets: `sm` 36 px, `md` 44 px, `lg` 48 px and `xl` 64 px.
 */
export type IconBoxSize = 'sm' | 'md' | 'lg' | 'xl'

// Background and glyph color of each tone.
const TONE_CLASS: Record<Tone, string> = {
  primary: 'bg-primary-container text-primary-strong',
  success: 'bg-secondary-container text-secondary-strong',
  warning: 'bg-tertiary-pale text-tertiary-strong',
  danger: 'bg-danger-container text-danger-strong',
  neutral: 'bg-primary-subtle text-content-secondary',
}

// Box dimension and radius of each size.
const SIZE_CLASS: Record<IconBoxSize, string> = {
  sm: 'size-9 rounded-sm',
  md: 'size-11 rounded-md',
  lg: 'size-12 rounded-md',
  xl: 'size-16 rounded-lg',
}

// Glyph size that matches each box.
const ICON_SIZE: Record<IconBoxSize, IconSize> = { sm: 'lg', md: 'xl', lg: 'xl', xl: '2xl' }

/**
 * Props accepted by {@link IconBox}.
 */
export interface IconBoxProps {
  /** Icon drawn in the center. */
  icon: IconName
  /**
   * Color family of the box.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone
  /**
   * Box dimension.
   *
   * @defaultValue `'md'`
   */
  size?: IconBoxSize
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders an icon inside a rounded, tinted square used by cards, stats and dialog headers.
 *
 * @example
 * ```tsx
 * <IconBox icon="group" tone="success" />
 * ```
 */
export function IconBox({ icon, tone = 'primary', size = 'md', className }: IconBoxProps) {
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center', TONE_CLASS[tone], SIZE_CLASS[size], className)}>
      <Icon name={icon} size={ICON_SIZE[size]} />
    </span>
  )
}
