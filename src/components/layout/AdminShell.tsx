/**
 * Provides the responsive administrator analytics shell.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import type { Teacher } from '@/types/course'
import { AppShell } from '@/components/layout/AppShell'
/** Props accepted by the administrator frame. */
export interface AdminShellProps {
  /** Administrator public profile. */
  profile: Teacher | null
  /** Opens the shared sign-out confirmation. */
  onSignOut: () => void
  /** Read-only analytics and confirmation content. */
  children: ReactNode
}
/**
 * Reuses the responsive app shell for read-only administrator navigation.
 *
 * @example
 * ```tsx
 * <AdminShell profile={profile} onSignOut={openLogout}><Outlet /></AdminShell>
 * ```
 */
export function AdminShell({ profile, onSignOut, children }: AdminShellProps) {
  return <AppShell sidebar={{ roleLabel: 'Administrador', teacher: profile, activeCourse: null, courseLinks: [], onSwitchCourse: () => {}, onSignOut,
    generalLinks: [{ to: '/admin/panel', label: 'Panel institucional', icon: 'query_stats', end: true },
      { to: '/admin/subtemas-criticos', label: 'Subtemas críticos', icon: 'insights' }] }}>{children}</AppShell>
}
