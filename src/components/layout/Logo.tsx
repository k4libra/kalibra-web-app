/**
 * Brand mark of the platform.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import logoUrl from '@/assets/kalibra-logo.svg'

/**
 * Renders the Kalibra logo and word mark.
 *
 * @example
 * ```tsx
 * <Logo />
 * ```
 */
export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <img src={logoUrl} alt="" width={32} height={32} className="size-8" />
      <span className="text-headline-m text-content-primary">Kalibra</span>
    </span>
  )
}
