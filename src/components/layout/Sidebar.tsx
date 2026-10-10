/**
 * Side navigation of the teacher panel.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { NavLink } from 'react-router'
import { Avatar, Button, Icon } from '@/components/ui'
import type { Course, Teacher } from '@/types/course'
import type { IconName } from '@/types/ui'
import { cn } from '@/utils/cn'
import { Logo } from './Logo'

/**
 * One link of the sidebar.
 */
export interface SidebarLink {
  /** Destination path. */
  to: string
  /** Visible text. */
  label: string
  /** Icon before the text. */
  icon: IconName
  /** Marks the link active only on its exact path, not on nested paths. */
  end?: boolean
}

/**
 * Props accepted by {@link Sidebar}.
 */
export interface SidebarProps {
  /** Public web role shown next to the brand. */
  roleLabel?: string
  /** Links that cover every course (block GENERAL). */
  generalLinks: SidebarLink[]
  /** Links of the active course (block CURSO ACTIVO); empty when there is no course. */
  courseLinks: SidebarLink[]
  /** Course the teacher is managing; `null` hides the active course block. */
  activeCourse: Course | null
  /** Signed-in teacher shown in the footer. */
  teacher: Teacher | null
  /** Called when the user opens the active course card to switch course. */
  onSwitchCourse: () => void
  /** Called when the user asks to sign out. */
  onSignOut: () => void
  /** Called after the user follows a link, to close the drawer on small screens. */
  onNavigate?: () => void
}

/**
 * Renders a navigation link with the active style of the sidebar.
 */
function SidebarNavLink({ link, onNavigate }: { link: SidebarLink; onNavigate?: () => void }) {
  return (
    <NavLink
      to={link.to}
      end={link.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2.5 text-label-l transition-colors',
          isActive ? 'bg-primary-container text-primary-strong' : 'text-content-secondary hover:bg-primary-subtle',
        )
      }
    >
      <Icon name={link.icon} size="lg" />
      {link.label}
    </NavLink>
  )
}

/**
 * Renders the brand, the general and active-course navigation, and the teacher footer.
 *
 * @example
 * ```tsx
 * <Sidebar generalLinks={general} courseLinks={course} activeCourse={course} teacher={teacher} onSwitchCourse={open} onSignOut={signOut} />
 * ```
 */
export function Sidebar({ generalLinks, courseLinks, activeCourse, teacher, onSwitchCourse, onSignOut, onNavigate, roleLabel = 'Docente' }: SidebarProps) {
  return (
    <nav aria-label="Navegación principal" className="flex h-full w-66 flex-col border-r border-line-subtle bg-surface-card px-4 pt-6 pb-5">
      <div className="flex items-center gap-2.5 px-2">
        <Logo />
        <span className="flex-1" />
        <span className="rounded-full bg-primary-container px-2.5 py-1 text-label-s text-content-secondary">{roleLabel}</span>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto pt-7">
        <p className="px-1 pb-1 text-label-s text-content-muted">GENERAL</p>
        {generalLinks.map((link) => (
          <SidebarNavLink key={link.to} link={link} onNavigate={onNavigate} />
        ))}

        {activeCourse && (
          <>
            <p className="px-1 pt-4 pb-1 text-label-s text-content-muted">CURSO ACTIVO</p>
            <button
              type="button"
              onClick={onSwitchCourse}
              aria-label={`Curso activo: ${activeCourse.name}. Cambiar de curso`}
              className="mb-1 flex cursor-pointer items-center gap-2.5 rounded-md bg-primary-subtle p-2.5 text-left hover:bg-primary-container-soft"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary-container text-primary-strong">
                <Icon name={activeCourse.icon} size="lg" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-body-m-bold text-content-primary">{activeCourse.name}</span>
                <span className="text-body-m text-content-secondary">
                  {activeCourse.code}{activeCourse.term ? ` · Ciclo ${activeCourse.term}` : ''}
                </span>
              </span>
              <Icon name="unfold_more" className="text-content-secondary" />
            </button>
            {courseLinks.map((link) => (
              <SidebarNavLink key={link.to} link={link} onNavigate={onNavigate} />
            ))}
          </>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-3 border-t border-line-subtle pt-4">
        {teacher && (
          <div className="flex items-center gap-2.5 px-2">
            <Avatar initials={teacher.initials} />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-label-l text-content-primary">{teacher.fullName}</span>
              <span className="truncate text-body-m text-content-secondary">{teacher.email}</span>
            </div>
          </div>
        )}
        <Button label="Cerrar sesión" icon="logout" variant="danger-soft" fullWidth onClick={onSignOut} />
      </div>
    </nav>
  )
}
