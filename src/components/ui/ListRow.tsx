/** Reusable action row on a rounded card.
 * @author Not specified
 * @packageDocumentation
 */
import type { ReactNode } from 'react'
import type { IconName, Tone } from '@/types/ui'
import { IconTile } from './IconTile'
import { Icon } from './Icon'
/** Renders row content and an optional action or controlled trailing switch. */
export function ListRow({ icon, tone, title, description, onClick, trailing }: { icon: IconName; tone?: Tone; title: string; description?: string; onClick?: () => void; trailing?: ReactNode }) {
  const content = <><IconTile icon={icon} tone={tone === 'success' ? 'secondary' : tone === 'warning' ? 'tertiary' : tone} /><span className="min-w-0 flex-1 text-left"><span className="block text-title">{title}</span>{' '}{description && <span className="block text-body-m text-content-secondary">{description}</span>}</span>{trailing ?? <span className="flex size-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><Icon name="chevron_right" /></span>}</>
  return onClick ? <button type="button" onClick={onClick} className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-3.5">{content}</button> : <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5">{content}</div>
}
