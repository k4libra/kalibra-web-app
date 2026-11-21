/**
 * Panel layout route composed from shared shell and auth dialog.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Callout, Button } from '@/components/ui'
import { Outlet } from 'react-router'
import { AppShell, CourseSwitcherDialog } from '@/components/layout'
import { LogoutConfirmModal } from '@/components/auth'
import { useShellNavigation } from '@/hooks/useShellNavigation'

/** Renders the panel frame and confirmations using {@link useShellNavigation} for all actions. */
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
        onSignOut: shell.logout.open,
      }}
    >
      {shell.workspaceError && <Callout icon="error" tone="danger" action={<Button label="Reintentar" onClick={shell.retryWorkspace} />}>{shell.workspaceError}</Callout>}
      <Outlet />
      <CourseSwitcherDialog
        isOpen={shell.isSwitcherOpen}
        courses={shell.courses}
        activeCourseId={shell.activeCourse?.id ?? null}
        onSelect={shell.selectCourse}
        onClose={shell.closeSwitcher}
      />
      <LogoutConfirmModal
        isOpen={shell.logout.isOpen}
        isSubmitting={shell.logout.isSubmitting}
        error={shell.logout.error}
        onConfirm={shell.logout.confirm}
        onCancel={shell.logout.cancel}
      />
    </AppShell>
  )
}
