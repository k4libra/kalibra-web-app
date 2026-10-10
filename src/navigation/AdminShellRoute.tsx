/**
 * Composes the administrator route shell and sign-out confirmation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Outlet } from 'react-router'
import { AdminShell } from '@/components/layout'
import { LogoutConfirmModal } from '@/components/auth'
import { useCurrentTeacher } from '@/hooks/useCurrentTeacher'
import { useLogout } from '@/hooks/useLogout'
/** Composes administrator analytics and the shared logout confirmation using profile and logout hooks. */
export function AdminShellRoute() {
  const { teacher } = useCurrentTeacher()
  const logout = useLogout()
  return <AdminShell profile={teacher} onSignOut={logout.open}>
    <Outlet />
    <LogoutConfirmModal isOpen={logout.isOpen} isSubmitting={logout.isSubmitting} error={logout.error} onConfirm={logout.confirm} onCancel={logout.cancel} />
  </AdminShell>
}
