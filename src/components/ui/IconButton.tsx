/**
 * Icon-only button primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IconName } from '@/types/ui'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

/**
 * Props accepted by {@link IconButton}.
 */
export interface IconButtonProps {
  /** Icon drawn inside the button. */
  icon: IconName
  /** Accessible name announced by screen readers. */
  label: string
  /** Called when the user activates the button. */
  onClick?: () => void
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a square, borderless button that only shows an icon, such as the close control of a dialog.
 *
 * @example
 * ```tsx
 * <IconButton icon="close" label="Cerrar" onClick={onClose} />
 * ```
 */
export function IconButton({ icon, label, onClick, className }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-sm text-content-secondary hover:bg-primary-subtle',
        className,
      )}
    >
      <Icon name={icon} size="lg" />
    </button>
  )
}
