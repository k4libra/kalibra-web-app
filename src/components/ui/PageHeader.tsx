/**
 * Page header primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

/**
 * Props accepted by {@link PageHeader}.
 */
export interface PageHeaderProps {
  /** Small uppercase line above the title, such as a breadcrumb. */
  eyebrow: string
  /** Main heading of the page. */
  title: string
  /** One-sentence explanation of the page. */
  description?: string
  /** Page-level actions, usually buttons. */
  actions?: ReactNode
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders the eyebrow, title, description and actions at the top of a page.
 *
 * @remarks
 * Actions stack under the titles on small screens and move to the right from `md`.
 *
 * @example
 * ```tsx
 * <PageHeader eyebrow="PANEL DOCENTE" title="Hola, Ricardo" actions={<Button label="Crear curso" />} />
 * ```
 */
export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 md:flex-row md:items-end md:gap-6', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-label-m text-content-muted uppercase">{eyebrow}</p>
        <h1 className="text-display text-content-primary">{title}</h1>
        {description && <p className="text-body-l text-content-secondary">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  )
}
