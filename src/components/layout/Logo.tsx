/**
 * Brand mark of the platform.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { cn } from '@/utils/cn'
import logoUrl from '@/assets/kalibra-logo.svg'

/** Props accepted by {@link Logo}. */
export interface LogoProps {
  /**
   * Brand presentation; inverse is used over primary backgrounds.
   *
   * @defaultValue `'default'`
   */
  tone?: 'default' | 'inverse'
}

const TONE_CLASS: Record<NonNullable<LogoProps['tone']>, string> = {
  default: 'text-content-primary',
  inverse: 'text-content-on-primary',
}

/**
 * Renders the Kalibra logo and word mark.
 *
 * @example
 * ```tsx
 * <Logo />
 * ```
 */
export function Logo({ tone = 'default' }: LogoProps) {
  return (
    <span className="flex items-center gap-2.5">
      <img src={logoUrl} alt="" width={32} height={32} className={tone === 'inverse' ? 'size-10' : 'size-8'} />
      <span className={cn(tone === 'inverse' ? 'text-headline-l' : 'text-headline-m', TONE_CLASS[tone])}>Kalibra</span>
    </span>
  )
}
