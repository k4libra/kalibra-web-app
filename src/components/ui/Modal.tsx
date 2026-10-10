/**
 * Modal dialog primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useEffect, useRef, useId, type ReactNode } from 'react'
import type { IconName, Tone } from '@/types/ui'
import { cn } from '@/utils/cn'
import { IconBox } from './IconBox'
import { IconButton } from './IconButton'
import { useDismiss } from './useDismiss'

/**
 * Maximum dialog widths: `sm` 420 px, `confirm` 460 px, `md` 480 px, `lg` 560 px and `xl` 640 px.
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'confirm'

// Maximum width of each size; the dialog is full width below it.
const SIZE_CLASS: Record<ModalSize, string> = {
  // The reference confirmation frame has an intrinsic 460 px dialog width.
  confirm: 'sm:max-w-[460px]',
  sm: 'sm:max-w-[420px]',
  md: 'sm:max-w-[480px]',
  lg: 'sm:max-w-[560px]',
  xl: 'sm:max-w-[640px]',
}

/**
 * Props accepted by {@link Modal}.
 */
export interface ModalProps {
  /** Whether the dialog is visible. */
  isOpen: boolean
  /** Called when the user closes the dialog (close button, Escape or backdrop). */
  onClose: () => void
  /** Heading of the dialog. */
  title: string
  /** Sentence under the heading. */
  description?: string
  /** Icon shown in a box before the heading. */
  icon?: IconName
  /**
   * Color family of the icon box.
   *
   * @defaultValue `'primary'`
   */
  iconTone?: Tone
  /**
   * Maximum width.
   *
   * @defaultValue `'lg'`
   */
  size?: ModalSize
  /**
   * Shows the close button in the header.
   *
   * @defaultValue `true`
   */
  showClose?: boolean
  /** Body of the dialog. */
  children?: ReactNode
  /** Buttons aligned at the end of the dialog. */
  actions?: ReactNode
}

/**
 * Renders a centered dialog over a dimmed backdrop.
 *
 * @remarks
 * On small screens the dialog sticks to the bottom edge; from `sm` it is centered.
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={close} title="Crear curso" icon="school" actions={<Button label="Crear" />} />
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  iconTone = 'primary',
  size = 'lg',
  showClose = true,
  children,
  actions,
}: ModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  useDismiss(isOpen, onClose)
  useEffect(() => {
    if (!isOpen) return
    const trigger = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
        ) ?? [],
      )
    const controls = focusable()
    ;(controls[0] ?? dialog)?.focus()
    const containFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = focusable()
      if (!items.length) {
        event.preventDefault()
        dialog?.focus()
        return
      }
      const first = items[0],
        last = items[items.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    dialog?.addEventListener('keydown', containFocus)
    return () => {
      dialog?.removeEventListener('keydown', containFocus)
      if (trigger?.isConnected) trigger.focus()
    }
  }, [isOpen])
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-content-primary/40" onClick={onClose} aria-hidden />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'relative flex max-h-full w-full flex-col gap-5 overflow-y-auto rounded-t-lg bg-surface-card p-6 shadow-floating sm:rounded-lg sm:p-7',
          SIZE_CLASS[size],
        )}
      >
        <div className="flex items-start gap-4">
          {icon && <IconBox icon={icon} tone={iconTone} size="lg" />}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 id={titleId} className="text-headline-l text-content-primary">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-body-l text-content-secondary">
                {description}
              </p>
            )}
          </div>
          {showClose && <IconButton icon="close" label="Cerrar" onClick={onClose} className="-mt-2 -mr-2" />}
        </div>
        {children}
        {actions && <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{actions}</div>}
      </div>
    </div>
  )
}
