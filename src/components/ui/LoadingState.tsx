/**
 * Loading state primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { cn } from '@/utils/cn'

/**
 * Props accepted by {@link LoadingState}.
 */
export interface LoadingStateProps {
  /**
   * Text announced while the content loads.
   *
   * @defaultValue `'Cargando…'`
   */
  label?: string
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a placeholder card while the data of a view is loading.
 *
 * @example
 * ```tsx
 * <LoadingState />
 * ```
 */
export function LoadingState({ label = 'Cargando…', className }: LoadingStateProps) {
  return (
    <div role="status" className={cn('flex items-center justify-center gap-3 rounded-lg bg-surface-card p-10 shadow-card', className)}>
      <span className="size-5 animate-spin rounded-full border-2 border-primary-container border-t-primary" aria-hidden />
      <span className="text-body-l text-content-secondary">{label}</span>
    </div>
  )
}
