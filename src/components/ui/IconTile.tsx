/** Pastel icon tile in the three approved component sizes.
 * @author Not specified
 * @packageDocumentation
 */
import type { IconName } from '@/types/ui'
import { Icon } from './Icon'
import { cn } from '@/utils/cn'
/** Approved semantic tones for the v2 tile. */
export type IconTileTone = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'neutral'
/** Renders a 40, 48 or 56px tile with proportionate vector geometry. */
export function IconTile({ icon, tone = 'primary', size = 40, className }: { icon: IconName; tone?: IconTileTone; size?: 40 | 48 | 56; className?: string }) {
  const tones = { primary:'bg-primary-container-soft text-primary-strong',secondary:'bg-secondary-pale text-secondary-strong',tertiary:'bg-tertiary-subtle text-tertiary-strong',danger:'bg-danger-container text-danger-strong',neutral:'border border-line-default bg-white text-content-secondary' }
  return <span className={cn('inline-flex shrink-0 items-center justify-center rounded-lg', tones[tone], size === 40 ? 'size-10' : size === 48 ? 'size-12' : 'size-14', className)}><Icon name={icon} size={size === 56 ? '2xl' : 'lg'} className={size === 48 ? 'size-6' : undefined} /></span>
}
