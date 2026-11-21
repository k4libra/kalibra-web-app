/**
 * Protects teacher and administrator routes after session restoration.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Navigate, Outlet } from 'react-router'
import { useSessionStatus } from '@/hooks/useSessionStatus'
import { Button, Callout, LoadingState } from '@/components/ui'
import { ROUTES } from '@/navigation/routes'
import { sessionHome } from '@/utils/sessionHome'

/** Holds all routes while the startup cookie session is unresolved. */
export function SessionResolution() {
  const status = useSessionStatus()
  if (status.isLoading) return <LoadingState label="Restaurando sesión…" />
  if (status.error) return <Callout icon="error" tone="danger" action={<Button label="Reintentar" onClick={status.retry} />}>{status.error}</Callout>
  return <Outlet />
}
/** Props accepted by the role-aware session boundary. */
export interface SessionGuardProps {
  /** Role permitted to render this route group. */
  role?: 'TEACHER' | 'ADMINISTRATOR'
}
/** Protects a route group and redirects other web roles to their own shell. */
export function SessionGuard({ role = 'TEACHER' }: SessionGuardProps) {
  const status = useSessionStatus()
  if (status.isLoading) return <LoadingState label="Restaurando sesión…" />
  if (status.error) return <Callout icon="error" tone="danger" action={<Button label="Reintentar" onClick={status.retry} />}>{status.error}</Callout>
  if (!status.session) return <Navigate to={ROUTES.signIn} replace />
  if (status.session.user.role !== role) return <Navigate to={sessionHome(status.session.user.role)} replace />
  return <Outlet />
}
/** Resolves root and unknown routes according to the hydrated role. */
export function SessionEntry() {
  const status = useSessionStatus()
  if (status.isLoading) return <LoadingState label="Restaurando sesión…" />
  if (status.error) return <Callout icon="error" tone="danger" action={<Button label="Reintentar" onClick={status.retry} />}>{status.error}</Callout>
  return <Navigate to={status.session ? sessionHome(status.session.user.role) : ROUTES.signIn} replace />
}
