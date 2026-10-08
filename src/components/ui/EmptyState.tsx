/**
 * Empty state primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import type { IconName } from '@/types/ui'
import { cn } from '@/utils/cn'
import { IconBox } from './IconBox'

/**
 * Props accepted by {@link EmptyState}.
 */
export interface EmptyStateProps {
  /** Icon that represents the missing content. */
  icon: IconName
  /** Short statement of what is missing. */
  title: string
  /** Explanation of why it is empty and what to do next. */
  description: string
  /** Call to action, usually a {@link Button}. */
  action?: ReactNode
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a centered card that explains why a view has no content yet.
 *
 * @example
 * ```tsx
 * <EmptyState icon="school" title="No courses yet" description="..." action={<Button label="Create" />} />
 * ```
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3 rounded-lg bg-surface-card px-6 py-12 text-center shadow-card', className)}>
      <IconBox icon={icon} size="xl" />
      <h2 className="text-headline-m text-content-primary">{title}</h2>
      <p className="max-w-[560px] text-body-l text-content-secondary">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
