/**
 * Page header primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import type { IconName } from '@/types/ui'

/**
 * Props accepted by {@link PageHeader}.
 */
export interface PageHeaderProps {
  /** Small uppercase line above the title, such as a breadcrumb. */
  eyebrow: ReactNode
  /** Main heading of the page. */
  title: string
  /** One-sentence explanation of the page. */
  description?: string
  /** Contextual instruction displayed beneath the description. */
  helper?: ReactNode
  /** Icon shown before a text helper line. */
  helperIcon?: IconName
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
export function PageHeader({ eyebrow, title, description, helper, helperIcon = 'info', actions, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 md:flex-row md:items-end md:gap-6', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-label-s text-content-muted uppercase">{eyebrow}</p>
        <h1 className="text-display text-content-primary">{title}</h1>
        {description && <p className="text-body-l text-content-secondary">{description}</p>}
        {helper && <div className="flex items-center gap-1.5 text-body-m-bold text-primary">{typeof helper === 'string' ? <><Icon name={helperIcon} size="xs" />{helper}</> : helper}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  )
}
