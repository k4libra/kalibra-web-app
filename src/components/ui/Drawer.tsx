/**
 * Side drawer primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { IconButton } from './IconButton'
import { useDismiss } from './useDismiss'

/**
 * Props accepted by {@link Drawer}.
 */
export interface DrawerProps {
  /** Whether the drawer is visible. */
  isOpen: boolean
  /** Called when the user closes the drawer (close button, Escape or backdrop). */
  onClose: () => void
  /** Heading of the drawer. */
  title: string
  /** Scrollable content. */
  children: ReactNode
  /** Footer pinned at the bottom, usually a close button. */
  footer?: ReactNode
}

/**
 * Renders a panel that slides over the right edge to show the detail of an item.
 *
 * @remarks
 * Full width on small screens; 520 px wide from `sm`.
 *
 * @example
 * ```tsx
 * <Drawer isOpen={Boolean(id)} onClose={close} title="Exercise detail">...</Drawer>
 * ```
 */
export function Drawer({ isOpen, onClose, title, children, footer }: DrawerProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!isOpen) return
    const trigger = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const controls = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]') ?? [])
    ;(controls()[0] ?? dialog)?.focus()
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = controls(), first = items[0], last = items[items.length - 1]
      if (!items.length) { event.preventDefault(); dialog?.focus() }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    dialog?.addEventListener('keydown', trap)
    return () => { dialog?.removeEventListener('keydown', trap); if (trigger?.isConnected) trigger.focus() }
  }, [isOpen])
  useDismiss(isOpen, onClose)
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-content-primary/40" onClick={onClose} aria-hidden />
      <aside
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full flex-col gap-4 bg-surface-card p-6 shadow-floating sm:max-w-[520px] sm:p-7"
      >
        <div className="flex items-center gap-3">
          <h2 id={titleId} className="flex-1 text-headline-l text-content-primary">
            {title}
          </h2>
          <IconButton variant="plain" size="sm" icon="close" label="Cerrar" onClick={onClose} className="-mr-2" />
        </div>
        <div className="-mx-1 flex flex-1 flex-col gap-4 overflow-y-auto px-1">{children}</div>
        {footer}
      </aside>
    </div>
  )
}
