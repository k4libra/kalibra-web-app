/**
 * Stat card primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IconName, Tone } from '@/types/ui'
import { cn } from '@/utils/cn'
import { IconBox } from './IconBox'

/**
 * Props accepted by {@link StatCard}.
 */
export interface StatCardProps {
  /** Icon that identifies the metric. */
  icon: IconName
  /**
   * Color family of the icon box.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone
  /** Value already formatted for display. */
  value: string
  /** Name of the metric. */
  label: string
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a headline metric with its icon, used in the summary row of a page.
 *
 * @example
 * ```tsx
 * <StatCard icon="school" value="2" label="Cursos activos" />
 * ```
 */
export function StatCard({ icon, tone = 'primary', value, label, className }: StatCardProps) {
  return (
    <div className={cn('flex items-center gap-3.5 rounded-lg bg-surface-card px-5 py-4.5 shadow-card', className)}>
      <IconBox icon={icon} tone={tone} />
      <div className="flex min-w-0 flex-col">
        <span className="text-display text-content-primary">{value}</span>
        <span className="text-body-m text-content-secondary">{label}</span>
      </div>
    </div>
  )
}
