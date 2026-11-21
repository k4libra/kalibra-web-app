/**
 * Icon-only button primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ButtonHTMLAttributes, Ref } from 'react'
import type { ActionIcon } from './Icon'
import { cn } from '@/utils/cn'
import { Icon } from '@/components/ui/Icon'

/**
 * Props accepted by {@link IconButton}.
 */
export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick' | 'aria-label'> {
  /** Icon drawn inside the button. */
  icon: ActionIcon
  /** Default elevation, tinted action, or unadorned overlay control. */
  variant?: 'default' | 'tinted' | 'plain'
  /** Intrinsic diameter. */
  size?: 'md' | 'sm' | 'xs'
  /** Native button reference used by focus-managed overlays. */
  ref?: Ref<HTMLButtonElement>
  /** Accessible name announced by screen readers. */
  label: string
  /** Called when the user activates the button. */
  onClick?: () => void
  /**
   * Blocks the action while the caller submits.
   *
   * @defaultValue `false`
   */
  disabled?: boolean
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
export function IconButton({ icon, label, onClick, disabled = false, className, ref, variant = 'default', size = 'md', ...attributes }: IconButtonProps) {
  const Graphic = icon
  return (
    <button
      {...attributes}
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 items-center justify-center rounded-full hover:bg-primary-subtle',
        size === 'sm' ? 'size-8' : size === 'xs' ? 'size-5' : 'size-10',
        variant === 'default' ? 'bg-white text-content-secondary shadow-subtle' : variant === 'tinted' ? 'bg-primary-subtle text-primary' : 'bg-transparent text-content-secondary',
        className,
      )}
    >
      {typeof Graphic === 'string' ? <Icon name={Graphic} size="lg" /> : <Graphic size="lg" />}
    </button>
  )
}
