/**
 * Layout route that wraps the pages of the teacher panel.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Outlet } from 'react-router'
import { AppShell, CourseSwitcherDialog } from '@/components/layout'
import { useShellNavigation } from '@/hooks/useShellNavigation'

/**
 * Renders the panel frame around the current page, using {@link useShellNavigation} for its data.
 */
export function ShellRoute() {
  const shell = useShellNavigation()
  return (
    <AppShell
      sidebar={{
        generalLinks: shell.generalLinks,
        courseLinks: shell.courseLinks,
        activeCourse: shell.activeCourse,
        teacher: shell.teacher,
        onSwitchCourse: shell.openSwitcher,
        onSignOut: shell.signOut,
      }}
    >
      <Outlet />
      <CourseSwitcherDialog
        isOpen={shell.isSwitcherOpen}
        courses={shell.courses}
        activeCourseId={shell.activeCourse?.id ?? null}
        onSelect={shell.selectCourse}
        onClose={shell.closeSwitcher}
      />
    </AppShell>
  )
}
