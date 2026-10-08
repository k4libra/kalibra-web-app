/**
 * Section header primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import type { IconName } from '@/types/ui'
import { cn } from '@/utils/cn'
import { IconBox } from './IconBox'

/**
 * Props accepted by {@link SectionHeader}.
 */
export interface SectionHeaderProps {
  /** Heading of the section. */
  title: string
  /** Secondary line under the heading. */
  subtitle?: string
  /** Icon shown in a small box before the heading. */
  icon?: IconName
  /** Element placed after the heading, usually a count chip. */
  trailing?: ReactNode
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders the heading of a group inside a page, such as the courses of a list.
 *
 * @example
 * ```tsx
 * <SectionHeader title="Your courses" trailing={<Chip label="2 courses" tone="neutral" />} />
 * ```
 */
export function SectionHeader({ title, subtitle, icon, trailing, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {icon && <IconBox icon={icon} size="sm" />}
      <div className="flex min-w-0 flex-col">
        <h2 className="text-headline-m text-content-primary">{title}</h2>
        {subtitle && <p className="text-body-m text-content-secondary">{subtitle}</p>}
      </div>
      {trailing}
    </div>
  )
}
