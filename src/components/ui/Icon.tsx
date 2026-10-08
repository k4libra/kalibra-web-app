/**
 * Icon primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IconName } from '@/types/ui'
import { cn } from '@/utils/cn'

/**
 * Optical sizes of an icon, in pixels: `xs` 14, `sm` 16, `md` 18, `lg` 20, `xl` 22, `2xl` 28.
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Pixel size of each preset; the glyph box matches the font size.
const SIZE_CLASS: Record<IconSize, string> = {
  xs: 'size-3.5 text-[14px]',
  sm: 'size-4 text-[16px]',
  md: 'size-[18px] text-[18px]',
  lg: 'size-5 text-[20px]',
  xl: 'size-[22px] text-[22px]',
  '2xl': 'size-7 text-[28px]',
}

/**
 * Props accepted by {@link Icon}.
 */
export interface IconProps {
  /** Material Symbols ligature to draw. */
  name: IconName
  /**
   * Optical size of the glyph.
   *
   * @defaultValue `'md'`
   */
  size?: IconSize
  /**
   * Draws the filled version of the symbol.
   *
   * @defaultValue `false`
   */
  filled?: boolean
  /** Accessible name; when omitted the icon is decorative and hidden from assistive technology. */
  label?: string
  /** Layout classes from the parent (margins, alignment). */
  className?: string
}

/**
 * Renders a Material Symbols Rounded glyph that inherits the current text color.
 *
 * @example
 * ```tsx
 * <Icon name="school" size="lg" />
 * ```
 */
export function Icon({ name, size = 'md', filled = false, label, className }: IconProps) {
  return (
    <span
      className={cn('icon-symbol inline-flex shrink-0 items-center justify-center', SIZE_CLASS[size], filled && 'icon-filled', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      {name}
    </span>
  )
}
