/** Numeric indicator used in place of notification dots.
 * @author Not specified
 * @packageDocumentation
 */
import { cn } from '@/utils/cn'
/** Displays an actual count supplied by its owner. */
export function CountBadge({ count, label, className }: { count: number; label?: string; className?: string }) {
  return <span aria-label={label} className={cn('inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-white bg-primary px-1.25 text-label-s text-white', className)}>{count}</span>
}
