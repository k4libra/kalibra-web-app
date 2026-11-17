/** Compact metrics on a single elevated surface.
 * @author Not specified
 * @packageDocumentation
 */
import type { ReactNode } from 'react'
import { IconTile } from './IconTile'
import type { IconName, Tone } from '@/types/ui'
/** A metric supplied by the current resource projection. */
export interface StatItemProps { icon: IconName; value: string; label: string; tone?: Tone }
/** Renders one metric with its semantic icon tile. */
export function StatItem({ icon, value, label, tone = 'primary' }: StatItemProps) {
  return <div className="flex min-w-0 flex-1 items-center gap-3.5 px-5 py-3">
    <IconTile icon={icon} tone={tone === 'success' ? 'secondary' : tone === 'warning' ? 'tertiary' : tone} />
    <div className="min-w-0"><p className="text-headline-l">{value}</p><p className="text-body-m text-content-secondary">{label}</p></div>
  </div>
}
/** Shares one card between metrics, with separators instead of separate cards. */
export function StatStrip({ children, label = 'Resumen' }: { children: ReactNode; label?: string }) {
  return <section aria-label={label} className="flex flex-col divide-y divide-line-subtle rounded-xl bg-white px-2 shadow-card sm:flex-row sm:divide-x sm:divide-y-0">{children}</section>
}
