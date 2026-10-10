/**
 * Text field primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useId, useState, type HTMLInputAutoCompleteAttribute, type ReactNode } from 'react'
import type { IconName } from '@/types/ui'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

/**
 * Validation look of a field: `default`, `error` (red tint) or `success` (green check).
 */
export type FieldStatus = 'default' | 'error' | 'success'

// Container treatment of each appearance.
const APPEARANCE_CLASS: Record<NonNullable<TextFieldProps['appearance']>, string> = {
  default: '',
  card: 'bg-surface-card',
}

// Border and background of each status.
const STATUS_CLASS: Record<FieldStatus, string> = {
  default: 'border-line-default bg-surface-background',
  error: 'border-danger bg-danger-container/35',
  success: 'border-secondary-strong bg-surface-background',
}

/**
 * Props accepted by {@link TextField}.
 */
export interface TextFieldProps {
  /** Visible label; when `hideLabel` is set it is only announced. */
  label: string
  /** Current value. */
  value: string
  /** Called with the new value on every keystroke. */
  onChange: (value: string) => void
  /** Hint shown while the field is empty. */
  placeholder?: string
  /** Icon at the start of the input. */
  icon?: IconName
  /**
   * Validation look.
   *
   * @defaultValue `'default'`
   */
  status?: FieldStatus
  /**
   * Native input type.
   *
   * @defaultValue `'text'`
   */
  type?: 'text' | 'email' | 'password'
  /** Native autocomplete hint. */
  autoComplete?: HTMLInputAutoCompleteAttribute
  /** Native name used by password managers. */
  name?: string
  /**
   * Whether editing is blocked during submission.
   *
   * @defaultValue `false`
   */
  disabled?: boolean
  /** Help or error content associated with the input. */
  description?: ReactNode
  /** Small hint aligned with the visible label. */
  labelHint?: string
  /**
   * Whether a trailing validation icon is shown.
   *
   * @defaultValue `true`
   */
  showStatusIcon?: boolean
  /**
   * Container treatment; `card` is used by standalone forms.
   *
   * @defaultValue `'default'`
   */
  appearance?: 'default' | 'card'
  /**
   * Hides the visible label and keeps it for assistive technology.
   *
   * @defaultValue `false`
   */
  hideLabel?: boolean
  /** Called when the user presses Enter inside the field. */
  onSubmit?: () => void
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a labelled single-line input with an optional leading icon.
 *
 * @example
 * ```tsx
 * <TextField label="Course name" icon="school" value={name} onChange={setName} />
 * ```
 */
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  icon,
  status = 'default',
  type = 'text',
  hideLabel = false,
  onSubmit,
  className,
  autoComplete,
  name,
  disabled = false,
  description,
  labelHint,
  appearance = 'default',
  showStatusIcon = true,
}: TextFieldProps) {
  const inputId = useId()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const descriptionId = `${inputId}-description`
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={inputId} className={cn('text-body-m-bold text-content-primary', hideLabel && 'sr-only')}>
          {label}
        </label>
        {labelHint && <span className="text-label-s text-content-muted">{labelHint}</span>}
      </div>
      <div
        className={cn(
          'flex h-11 items-center gap-2.5 rounded-md border px-3 focus-within:outline-2 focus-within:outline-primary',
          STATUS_CLASS[status],
          APPEARANCE_CLASS[appearance],
        )}
      >
        {icon && <Icon name={icon} className="text-content-secondary" />}
        <input
          id={inputId}
          type={type === 'password' && isPasswordVisible ? 'text' : type}
          autoComplete={autoComplete}
          name={name}
          disabled={disabled}
          aria-describedby={description ? descriptionId : undefined}
          value={value}
          placeholder={placeholder}
          aria-invalid={status === 'error' || undefined}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && onSubmit) {
              event.preventDefault()
              onSubmit()
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-body-l text-content-primary outline-none placeholder:text-content-muted"
        />
        {type === 'password' && (
          <IconButton
            icon={isPasswordVisible ? 'visibility_off' : 'visibility'}
            label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="-mr-3 text-primary"
          />
        )}
        {showStatusIcon && type !== 'password' && status === 'error' && <Icon name="edit" className="text-danger" />}
        {status === 'success' && <Icon name="check_circle" className="text-secondary-strong" />}
      </div>
      {description && (
        <div id={descriptionId} className="text-body-m text-content-secondary">
          {description}
        </div>
      )}
    </div>
  )
}
