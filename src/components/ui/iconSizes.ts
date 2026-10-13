/**
 * Shares optical dimensions between ligature and SVG icons.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IconSize } from './Icon'

// Pixel size of each preset; the glyph box matches the font size.
/** Maps optical sizes to the shared glyph and SVG dimensions. */
export const ICON_SIZE_CLASS: Record<IconSize, string> = {
  xs: 'size-3.5 text-[14px]',
  sm: 'size-4 text-[16px]',
  md: 'size-[18px] text-[18px]',
  lg: 'size-5 text-[20px]',
  xl: 'size-[22px] text-[22px]',
  '2xl': 'size-7 text-[28px]',
}

