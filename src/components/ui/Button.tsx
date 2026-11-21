/**
 * Button primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ButtonSize, ButtonVariant, IconName } from '@/types/ui'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

// Color classes of each variant, including hover and disabled states.
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-content-on-primary shadow-raised hover:bg-primary-strong',
  tonal: 'bg-primary-container-soft text-primary-strong hover:bg-primary-pale-soft',
  neutral: 'bg-primary-container-soft text-primary-strong hover:bg-primary-container',
  danger: 'bg-danger-container text-danger hover:bg-danger-container/80',
  'danger-soft': 'bg-primary-subtle text-danger hover:bg-danger-container',
  ghost: 'border border-line-default bg-white text-content-primary hover:bg-primary-subtle',
}

// Height, padding and radius of each size.
const SIZE_CLASS: Record<ButtonSize, string> = {
  lg: 'h-13 gap-2 rounded-full px-6',
  md: 'h-11 gap-2 rounded-full px-6',
  sm: 'h-8 gap-1.5 rounded-full px-3',
}

/**
 * Props accepted by {@link Button}.
 */
export interface ButtonProps {
  /** Text shown inside the button. */
  label: string
  /**
   * Visual style of the button.
   *
   * @defaultValue `'primary'`
   */
  variant?: ButtonVariant
  /**
   * Height and padding preset.
   *
   * @defaultValue `'md'`
   */
  size?: ButtonSize
  /** Icon rendered next to the label. */
  icon?: IconName
  /**
   * Side of the label where the icon goes.
   *
   * @defaultValue `'start'`
   */
  iconPosition?: 'start' | 'end'
  /**
   * Stretches the button to the width of its container.
   *
   * @defaultValue `false`
   */
  fullWidth?: boolean
  /**
   * Blocks interaction and dims the button.
   *
   * @defaultValue `false`
   */
  disabled?: boolean
  /** Native tooltip, including the reason an action is disabled. */
  title?: string
  /** Pressed state when used as a toggle button; omitted for ordinary actions. */
  isPressed?: boolean
  /**
   * Native button type.
   *
   * @defaultValue `'button'`
   */
  type?: 'button' | 'submit'
  /** Called when the user activates the button. */
  onClick?: () => void
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders the call-to-action control of the design system.
 *
 * @remarks
 * Use one `primary` button per view or dialog. Cancel actions use `neutral`.
 *
 * @example
 * ```tsx
 * <Button label="Crear curso" icon="add" onClick={handleCreate} />
 * ```
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  fullWidth = false,
  disabled = false,
  title,
  isPressed,
  type = 'button',
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      title={title}
      aria-pressed={isPressed}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center text-label-l whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {icon && iconPosition === 'start' && <Icon name={icon} />}
      <span>{label}</span>
      {icon && iconPosition === 'end' && <Icon name={icon} />}
    </button>
  )
}
