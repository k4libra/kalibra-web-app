/**
 * Table primitives of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

/**
 * Props accepted by {@link TableCard}.
 */
export interface TableCardProps {
  /** Header row and rows of the table. */
  children: ReactNode
  /** Accessible name of the table. */
  label: string
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders the white container of a responsive table.
 *
 * @remarks
 * Rows are stacked cards on small screens and a grid from `md`: compose it with {@link TableHeader}
 * and {@link TableRow}, giving both the same `md:grid-cols-*` classes.
 *
 * @example
 * ```tsx
 * <TableCard label="Subtemas"><TableHeader columns={['#', 'Subtema']} className="md:grid-cols-12" />...</TableCard>
 * ```
 */
export function TableCard({ children, label, className }: TableCardProps) {
  return (
    <div role="table" aria-label={label} className={cn('overflow-hidden rounded-lg bg-surface-card shadow-card', className)}>
      {children}
    </div>
  )
}

/**
 * Props accepted by {@link TableHeader}.
 */
export interface TableHeaderProps {
  /** Column titles; each one is wrapped in a cell that receives the matching class from `cellClassNames`. */
  columns: string[]
  /** Column span classes, one per column (for example `md:col-span-4`). */
  cellClassNames?: string[]
  /** Grid template classes shared with the rows (for example `md:grid-cols-12`). */
  className?: string
}

/**
 * Renders the column titles of a {@link TableCard}; hidden on small screens.
 *
 * @example
 * ```tsx
 * <TableHeader columns={['Exercise', 'Action']} cellClassNames={['md:col-span-9', 'md:col-span-3']} className="md:grid-cols-12" />
 * ```
 */
export function TableHeader({ columns, cellClassNames = [], className }: TableHeaderProps) {
  return (
    <div role="row" className={cn('hidden gap-4 bg-primary-subtle px-4 py-3 md:grid', className)}>
      {columns.map((column, index) => (
        <span key={column} role="columnheader" className={cn('text-label-s text-content-secondary uppercase', cellClassNames[index])}>
          {column}
        </span>
      ))}
    </div>
  )
}

/**
 * Props accepted by {@link TableRow}.
 */
export interface TableRowProps {
  /** Cells of the row. */
  children: ReactNode
  /** Grid template classes shared with the header (for example `md:grid-cols-12`). */
  className?: string
}

/**
 * Renders one row of a {@link TableCard}: a stacked block on small screens and a grid row from `md`.
 *
 * @example
 * ```tsx
 * <TableRow className="md:grid-cols-12">...</TableRow>
 * ```
 */
export function TableRow({ children, className }: TableRowProps) {
  return (
    <div role="row" className={cn('flex flex-col gap-3 border-t border-line-subtle px-4 py-4 first:border-t-0 md:grid md:items-center md:gap-4', className)}>
      {children}
    </div>
  )
}
