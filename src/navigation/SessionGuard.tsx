/**
 * Session-aware entry redirects and protected panel route boundary.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthSession } from '@/hooks/useAuthSession'
import { ROUTES } from '@/navigation/routes'

/** Protects every panel route using the current mock identity. */
export function SessionGuard() {
  const session = useAuthSession()
  const { search } = useLocation()
  return session ? <Outlet /> : <Navigate to={{ pathname: ROUTES.signIn, search }} replace />
}

/** Resolves root and unknown routes according to the current session. */
export function SessionEntry() {
  const session = useAuthSession()
  const { search } = useLocation()
  return <Navigate to={{ pathname: session ? ROUTES.courses : ROUTES.signIn, search }} replace />
}
