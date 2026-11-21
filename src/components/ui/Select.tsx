/**
 * Select primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { IconName } from '@/types/ui'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

/**
 * One choice of a {@link Select}.
 *
 * @typeParam T - Union of the option values.
 */
export interface SelectOption<T extends string> {
  /** Value reported when the option is chosen. */
  value: T
  /** Main text of the option. */
  label: string
  /** Secondary line under the label. */
  description?: string
  /** Prevents choosing the option. */
  disabled?: boolean
  /** Element shown at the end of the option, such as a status chip. */
  trailing?: ReactNode
}

/**
 * Props accepted by {@link Select}.
 *
 * @typeParam T - Union of the option values.
 */
export interface SelectProps<T extends string> {
  /** Visible label of the field. */
  label: string
  /** Options listed in the dropdown, in order. */
  options: SelectOption<T>[]
  /** Value of the selected option. */
  value: T
  /** Called with the value of the option the user chooses. */
  onChange: (value: T) => void
  /** Icon at the start of the trigger. */
  icon?: IconName
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a dropdown field whose options can carry a description and a status.
 *
 * @typeParam T - Union of the option values.
 *
 * @example
 * ```tsx
 * <Select label="Curso" icon="school" options={courseOptions} value={courseId} onChange={setCourseId} />
 * ```
 */
export function Select<T extends string>({ label, options, value, onChange, icon, className }: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const labelId = useId()
  const listId = useId()
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className={cn('relative flex flex-col gap-1.5', className)}>
      <span id={labelId} className="text-body-m-bold text-content-primary">
        {label}
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-labelledby={labelId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 cursor-pointer items-center gap-2.5 rounded-md border border-line-default bg-surface-background px-3 text-left"
      >
        {icon && <Icon name={icon} className="text-content-secondary" />}
        <span className="min-w-0 flex-1 truncate text-body-l text-content-primary">{selected?.label}</span>
        <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="text-content-secondary" />
      </button>
      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute top-full right-0 left-0 z-10 mt-1 flex flex-col gap-0.5 rounded-md border border-line-default bg-surface-card p-1.5 shadow-floating"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              tabIndex={option.disabled ? -1 : 0}
              onClick={() => {
                if (option.disabled) return
                onChange(option.value)
                setIsOpen(false)
              }}
              onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && !option.disabled) {
                  event.preventDefault()
                  onChange(option.value)
                  setIsOpen(false)
                }
              }}
              className={cn(
                'flex items-center gap-2.5 rounded-sm px-3 py-2.5',
                option.value === value && 'bg-primary-subtle',
                option.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-primary-subtle',
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-label-l text-content-primary">{option.label}</span>
                {option.description && <span className="text-body-m text-content-secondary">{option.description}</span>}
              </div>
              {option.trailing}
              {option.value === value && <Icon name="check" className="text-primary-strong" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
