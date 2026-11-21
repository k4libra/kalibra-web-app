/**
 * Provides a keyboard-accessible menu for contextual row actions.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { Icon, type ActionIcon } from './Icon'
import { IconButton } from './IconButton'
import { cn } from '@/utils/cn'

/** Describes one action and its optional disabled explanation. */
export interface ActionMenuItem {
  /** Stable identity within the menu. */
  id: string
  /** Visible action name. */
  label: string
  /** Ligature or decorative SVG displayed before the name. */
  icon: ActionIcon
  /** Called only when the action is available. */
  onSelect: () => void
  /** Prevents activation while keeping the action discoverable. */
  disabled?: boolean
  /** Explanation associated with a disabled action. */
  disabledReason?: string
  /** Marks a destructive action with the danger token. */
  danger?: boolean
}

/** Props accepted by {@link ActionMenu}. */
export interface ActionMenuProps {
  /** Accessible name identifying the row controlled by the trigger. */
  label: string
  /** Actions displayed in their navigation order. */
  items: ActionMenuItem[]
  /**
   * Blocks opening while the caller saves or refreshes.
   *
   * @defaultValue `false`
   */
  disabled?: boolean
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a more-actions trigger with focus-managed menu items and disabled reasons.
 *
 * @remarks
 * The portal avoids clipping inside table cards. Disabled items remain keyboard-focusable so
 * their explanations can be read. Tab exits the menu; Escape and selection return trigger focus.
 *
 * @example
 * ```tsx
 * <ActionMenu label="Topic actions" items={[{ id: 'edit', label: 'Rename', icon: 'edit', onSelect: rename }]} />
 * ```
 */
export function ActionMenu({ label, items, disabled = false, className }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const initialFocus = useRef<'first' | 'last'>('first')
  const id = useId()
  const isVisible = isOpen && !disabled
  const close = (restoreFocus = true) => {
    setIsOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  useLayoutEffect(() => {
    if (!isVisible) return
    const trigger = triggerRef.current, menu = menuRef.current
    if (!trigger || !menu) return
    const anchor = trigger.getBoundingClientRect()
    const bounds = menu.getBoundingClientRect()
    // The viewport margin follows the menu's token-based padding instead of a new pixel value.
    const margin = parseFloat(getComputedStyle(menu).paddingTop) || 0
    const left = Math.max(margin, Math.min(anchor.right - bounds.width, window.innerWidth - bounds.width - margin))
    const top = anchor.bottom + bounds.height + margin <= window.innerHeight
      ? anchor.bottom : Math.max(margin, anchor.top - bounds.height)
    menu.style.left = `${left}px`
    menu.style.top = `${top}px`
    const controls = menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    ;(initialFocus.current === 'last' ? controls[controls.length - 1] : controls[0])?.focus()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
    const dismissOutside = (event: Event) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }
    const dismissOnResize = () => { setIsOpen(false); triggerRef.current?.focus() }
    const dismissOnScroll = (event: Event) => {
      if (!(event.target instanceof Node) || !menuRef.current?.contains(event.target)) dismissOnResize()
    }
    document.addEventListener('pointerdown', dismissOutside)
    document.addEventListener('focusin', dismissOutside)
    document.addEventListener('scroll', dismissOnScroll, true)
    window.addEventListener('resize', dismissOnResize)
    return () => {
      document.removeEventListener('pointerdown', dismissOutside)
      document.removeEventListener('focusin', dismissOutside)
      document.removeEventListener('scroll', dismissOnScroll, true)
      window.removeEventListener('resize', dismissOnResize)
    }
  }, [isVisible])

  const navigate = (event: KeyboardEvent<HTMLDivElement>) => {
    const controls = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])
    const index = controls.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return }
    if (event.key === 'Tab') { close(); return }
    let target: number | undefined
    if (event.key === 'ArrowDown') target = (index + 1) % controls.length
    if (event.key === 'ArrowUp') target = (index - 1 + controls.length) % controls.length
    if (event.key === 'Home') target = 0
    if (event.key === 'End') target = controls.length - 1
    if (target !== undefined) { event.preventDefault(); controls[target]?.focus() }
  }

  return <>
    <IconButton ref={triggerRef} id={`${id}-trigger`} icon="more_vert" label={label} className={className}
      disabled={disabled} aria-haspopup="menu" aria-expanded={isVisible} aria-controls={isVisible ? id : undefined}
      onClick={() => { initialFocus.current = 'first'; setIsOpen(!isVisible) }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          initialFocus.current = event.key === 'ArrowUp' ? 'last' : 'first'
          setIsOpen(true)
        }
      }} />
    {isVisible && createPortal(
      <div ref={menuRef} id={id} role="menu" aria-labelledby={`${id}-trigger`} onKeyDown={navigate}
        // The viewport cap is intrinsic overlay geometry; all spacing and colors use tokens.
        className="fixed z-30 w-(--container-action-menu) max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-md border border-line-default bg-surface-card p-2 shadow-floating">
        {items.map((item) => {
          const Graphic = item.icon
          const reasonId = `${id}-${item.id}-reason`
          return <button key={item.id} type="button" role="menuitem" tabIndex={-1}
            aria-label={item.label}
            aria-disabled={item.disabled || undefined} aria-describedby={item.disabled && item.disabledReason ? reasonId : undefined}
            onClick={() => { if (!item.disabled) { close(); item.onSelect() } }}
            className={cn('flex min-h-11 w-full items-start gap-3 rounded-sm px-3 py-3 text-left text-label-l hover:bg-primary-subtle focus-visible:bg-primary-subtle',
              item.disabled ? 'cursor-not-allowed text-content-muted' : item.danger ? 'cursor-pointer text-danger' : 'cursor-pointer text-content-primary')}>
            {typeof Graphic === 'string' ? <Icon name={Graphic} size="lg" /> : <Graphic size="lg" />}
            <span className="flex min-w-0 flex-col gap-1">
              <span>{item.label}</span>
              {item.disabled && item.disabledReason && <span id={reasonId} className="text-body-m">{item.disabledReason}</span>}
            </span>
          </button>
        })}
      </div>, document.body,
    )}
  </>
}
