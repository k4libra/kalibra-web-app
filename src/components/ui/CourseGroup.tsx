/** Expandable course section shared by the grouped desktop lists.
 * @author Not specified
 * @packageDocumentation
 */
import { useState, type ReactNode } from 'react'
import type { CourseOverview } from '@/types/course'
import { IconBox } from './IconBox'
import { IconButton } from './IconButton'
import { Chip } from './Chip'
import { Icon } from './Icon'
import type { IconName } from '@/types/ui'
/** Keeps the real course metadata, count and empty action visible when collapsed. */
export function CourseGroup({ course, countLabel, countIcon, children, emptyMessage, action }: { course: CourseOverview; countLabel: string; countIcon?: IconName; children?: ReactNode; emptyMessage?: string; action?: ReactNode }) {
  const [expanded, setExpanded] = useState(true)
  return <section className="overflow-hidden rounded-xl bg-white shadow-card">
    <header className="flex min-h-18 items-center gap-3.5 px-6 py-3">
      <IconBox icon={course.icon} size="lg" /><div className="min-w-0 flex-1"><h2 className="text-title">{course.name}</h2><p className="text-body-m text-content-secondary">{[course.code, course.term ? `Ciclo ${course.term}` : '', course.faculty, course.semester].filter(Boolean).join(' · ')}</p>{emptyMessage && <p className="mt-0.5 flex items-center gap-1 text-body-m-bold text-primary"><Icon name="info" size="xs" />{emptyMessage}</p>}</div>
      <Chip label={countLabel} icon={countIcon} tone={emptyMessage ? 'neutral' : 'primary'} />{action}
      {children && <IconButton variant="tinted" size="sm" icon={expanded ? 'expand_less' : 'expand_more'} label={`${expanded ? 'Contraer' : 'Expandir'} ${course.name}`} aria-expanded={expanded} onClick={() => setExpanded(!expanded)} className="size-8 bg-primary-subtle text-primary shadow-none" />}
    </header>
    {expanded && children}
  </section>
}
